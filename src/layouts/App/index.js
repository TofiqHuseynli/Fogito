import React from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import { settings, translations } from "@actions";
import { MENU_ROUTES, API_ROUTES, config } from "@config";
import {
  ErrorBoundary,
  Error,
  Content,
  Loading,
  Api,
  Auth,
  App as AppLib,
} from "fogito-core-ui";
import { Lang } from "@plugins";

export const App = () => {
  const location = useLocation();
  const [loading, setLoading] = React.useState(true);

  const loadSettings = async (params) => {
    const response = await settings(params);
    return response
      ? {
          account_data: response.account_data,
          company: response.company,
          langs: response.langs,
          permissions: response.permissions,
        }
      : false;
  };

  const loadTranslations = async (params) => {
    const response = await translations(params);
    return response
      ? {
          lang: response.data?.lang,
          lang_data: response.data?.lang_data,
        }
      : false;
  };

  const loadData = async () => {
    const common = parent.window.common;
    if (common) {
      let { account_data, lang, langs, USER } = common;
      const translations = await loadTranslations({ lang: lang?.short_code });
      Auth.setData({ ...account_data });
      Lang.setData({ ...translations, ...{ langs } });
      AppLib.setData({ USER });
      setLoading(false);
    } else {
      const settings = await loadSettings();
      const translations = await loadTranslations();
      Auth.setData({
        ...settings.account_data,
        permissions: settings.permissions,
        company: settings.company,
      });
      Lang.setData({ ...translations, ...{ langs: settings.langs } });
      setLoading(false);
    }
  };

  const renderRoutes = (routes) => {
    return routes.map((route, key) => (
      <Route
        exact={route.isExact}
        path={route.path}
        render={(props) =>
          route.nestedRoutes ? (
            <Switch>
              {route.nestedRoutes.map((item, key) => (
                <Route
                  exact={item.isExact}
                  path={route.path + item.path}
                  render={(props) =>
                    item.component({
                      ...props,
                      ...{ name: item.name },
                    })
                  }
                  key={key}
                />
              ))}
              <Redirect to={route.path} />
            </Switch>
          ) : (
            route.component({
              ...props,
              ...{ name: route.name },
            })
          )
        }
        key={key}
      />
    ));
  };

  window.onThemeChange = (theme) => {
    document.body.className = theme;
  };

  React.useEffect(() => {
    if (process.env.frameMode) {
      const path =
        process.env.publicPath.replace("/service", "") +
        location.pathname +
        location.search;
      if (parent.window?.historyPush) {
        parent.window.historyPush(path);
      } else {
        window.location.replace(path);
      }
    }
  }, [location]);

  React.useEffect(() => {
    Api.setRoutes(API_ROUTES);
    Api.setParams({ app_id: config.appID });
    AppLib.setData({
      appName: config.appName,

      // functions
      jsonDesign(json) {
        if (typeof json != "string") {
          json = JSON.stringify(json, undefined, 4);
        }
        json = json
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        return json.replace(
          /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
          function (match) {
            var cls = "number";
            if (/^"/.test(match)) {
              if (/:$/.test(match)) {
                cls = "key";
              } else {
                cls = "string";
              }
            } else if (/true|false/.test(match)) {
              cls = "boolean";
            } else if (/null/.test(match)) {
              cls = "null";
            }
            return '<span class="' + cls + '">' + match + "</span>";
          }
        );
      },

      createMarkup(text) {
        return { __html: text };
      },
    });

    loadData();
  }, []);

  if (loading) {
    return <Loading type="whole" />;
  }

  if (!Auth.isAuthorized()) {
    return <Error message={Lang.get("NotAuthorized")} />;
  }

  return (
    <ErrorBoundary>
      <Content sidebar={false}>
        <Switch>
          {renderRoutes(MENU_ROUTES)}
          <Redirect from="*" to="/projects" />
        </Switch>
      </Content>
    </ErrorBoundary>
  );
};
