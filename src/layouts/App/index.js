import React from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { settings, translations } from "@actions";
import { MENU_ROUTES ,API_ROUTES, config } from "@config";
import {
  ErrorBoundary,
  Error,
  Content,
  useCookie,
  Loading,
  Auth,
  App as AppLib,
} from "fogito-core-ui";
import {Lang} from "@plugins";


export const App = () => {
  const cookie = useCookie();
  const history = useHistory();
  const [loading, setLoading] = React.useState(true);

  const loadSettings = async (params) => {
    const response = await settings(params);
    return response
        ? {
          account_data: response.account_data,
          langs: response.langs,
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
      let { account_data, token, lang, langs } = common;
      const translations = await loadTranslations({
        token,
        lang: lang?.short_code,
      });
      Auth.setData({ ...account_data, token });
      Lang.setData({ ...translations, ...{ langs } });
      setLoading(false);
    } else {
      const token = cookie.get("_token") || false;
      // const token = request_uri.token || cookie.get("_token") || false;
      // const token = 'O9Nbbb4bI1b0H4RcTb76J5g5k9ma2A6Y779ddhd_cM7C22c85Rf25B6W5U4Adt6k9C9D4_a2d2a1ff5b46595c5b4617401c45e8c1759bcd92'

      const settings = await loadSettings({ token });
      const translations = await loadTranslations({ token });
      Auth.setData({ ...settings.account_data, token });
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

  window.onModeChange = (mode) => {
    document.body.className = mode;
  };

  React.useEffect(() => {
    if (process.env.FRAME_MODE && parent.window?.historyPush) {
      history.listen((location) => {
        parent.window.historyPush(
            process.env.PUBLIC_URL.replace("/frame", "") +
            location.pathname +
            location.search
        );
      });
    }
  }, [history]);

  React.useEffect(() => {
    AppLib.setData({
      ...config,
      API_ROUTES,
      NODE_ENV: process.env.NODE_ENV,

      // functions
      jsonDesign (json) {
        if (typeof json != 'string') {
          json = JSON.stringify(json, undefined, 4);
        }
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
          var cls = 'number';
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = 'key';
            } else {
              cls = 'string';
            }
          } else if (/true|false/.test(match)) {
            cls = 'boolean';
          } else if (/null/.test(match)) {
            cls = 'null';
          }
          return '<span class="' + cls + '">' + match + '</span>';
        })
      },

      createMarkup(text) {
        return { __html: text };
      }
    });

    loadData();
  }, []);

  if (loading) {
    return <Loading type='whole' />;
  }

  if (!Auth.isAuth()) {
    return <Error message={Lang.get("NotAuthorized")} />;
  }


  return (
    <ErrorBoundary>
      <Content>
        <Switch>
          {renderRoutes(MENU_ROUTES)}
          {/* You must add your default root here */}
          <Redirect from="*" to="/projects" />
        </Switch>
      </Content>
    </ErrorBoundary>
  );
};
