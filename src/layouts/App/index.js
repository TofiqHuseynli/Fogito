import React from "react";
import qs from "querystring";
import { Switch, Route, Redirect, useHistory, useLocation } from "react-router-dom";
import { settings, translations } from "@actions";
import { SidebarProvider } from "@contexts";
import { useCookie } from "@hooks";
import { MENU_ROUTES } from "@config";
import {Auth, Lang} from "@plugins";
import {
  ErrorBoundary,
  AuthError,
  Loading,
  Content,
} from "@components";

export const App = () => {
  const cookie = useCookie();
  const history = useHistory();
  const location = useLocation();
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
      const request_uri = qs.parse(location.search);
      // const token = request_uri.token || cookie.get("_token") || false;
      const token = 'O9Nbbb4bI1b0H4RcTb76J5g5k9ma2A6Y779ddhd_cM7C22c85Rf25B6W5U4Adt6k9C9D4_a2d2a1ff5b46595c5b4617401c45e8c1759bcd92'

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
    loadData();
  }, []);

  if (loading) {
    return <Loading bgClass="bg-white" />;
  }

  if (!Auth.isAuth()) {
    return <AuthError message={Lang.get("NotAutorized")} />;
  }


  return (
    <ErrorBoundary>
      <SidebarProvider>
        <Content>
          <Switch>
            {renderRoutes(MENU_ROUTES)}
            {/* You must add your default root here */}
            <Redirect from="*" to="/projects" />
          </Switch>
        </Content>
      </SidebarProvider>
    </ErrorBoundary>
  );
};
