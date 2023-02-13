import React from "react";
import { Permissions } from "@components";
import { workspacesData, workspacesInfo, workspacesUpdate } from "@actions";
import { General } from "./components";
import { Link } from "react-router-dom";
import { workspaceUsersList } from "@actions";
import {
  Popup,
  ErrorBoundary,
  Loading,
  AppContext,
  useModal,
  useToast,
  Lang
} from "fogito-core-ui";
import { Tab, TabPanel, Tabs } from "@components";
import GlobalVariablesBox from "@layouts/Workspaces/components/GlobalVariablesBox";

export const Edit = ({
  name,
  match: {
    params: { id },
    path,
  },
  history,
  onClose,
}) => {
  //  actions
  const [state, setState] = React.useReducer(
    (prevState, newState) => ({
      ...prevState,
      ...newState,
    }),
    {
      id,
      loading: false,
      updated: false,
      activeTab: "general",
      data: {
        title: "",
        slug: "",
        description: "",
        api_url: "",
        api_path: "",
        members: false,
        status: "",
        public: "",
        global_variables: [],
      },
      permissions_data: [],
      status_data: [],
      public_data: [],
      editor_type: "json",
      employees: {},
      userIds: [],
    }
  );

  const [params, setParams] = React.useState();

  const toast = useToast();
  const modal = useModal();

  const { setProps } = React.useContext(AppContext);

  const refresh = async () => {
    setState({ loading: true });
    let id = state.id;
    let response = await workspacesInfo({ id });
    if (response.status === "success") {
      setState({
        data: { ...response.data },
        loading: false,
        employees: response.data.members,
      });
      console.log("clgData response", response);
    }
  };

  const getUsers = async () => {
    let response = await workspaceUsersList({ data: { project_id: state.id } });
    if (response.status === "success") {
      setState({
        users: response.data,
        userIds: response.data.map((item) => item.id),
      });
    }
  };

  const getList = async () => {
    let response = await workspacesData();
    if (response.status === "success") {
      setState({
        status_data: response.data.status,
        public_data: response.data.public,
      });
    }
  };

  const getUpdate = async () => {
    let response = await workspacesUpdate({
      id: state.id,
      data: state.data,
    });
    if (response.status === "success") {
      toast.fire({
        title: response.description,
        icon: "success",
      });
    } else {
      toast.fire({
        title: response.description,
        icon: "error",
      });
    }
  };

  React.useEffect(() => {
    refresh();
    getList();
    getUsers();
  }, []);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const TABS = [
    {
      key: "general",
      title: "General",
      permission: true,
      component: <General state={state} setState={setState} />,
    },
    {
      key: "permissions",
      title: "Permissions",
      permission: true,
      component: (
        <div className="row">
          <div className="col-md-8">
            <label>{Lang.get("Permissions")}</label>
            <Permissions state={state} setState={setState} />
          </div>
        </div>
      ),
    },
    {
      key: "globalVariables",
      title: "Global Variables",
      permission: true,
      component: (
        <div className="row">
          <div className="col-md-8">
            <label>{Lang.get("GlobalVariables")}</label>
            <GlobalVariablesBox
              variables={state.data?.global_variables || []}
              setVars={(globalVariables) =>
                setState({
                  data: {
                    ...state.data,
                    global_variables: globalVariables,
                  },
                })
              }
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <ErrorBoundary>
      <Popup
        size="xl"
        show
        onClose={() => onClose()}
        header={
          <div className="d-flex align-items-center justify-content-between w-100">
            <div>
              <button
                className="btn btn-primary lh-24 px-3 text-center"
                onClick={() => history.goBack()}
              >
                <i className="feather feather-chevron-left fs-20 " />
              </button>
            </div>

            <h3 className="text-primary">{Lang.get(name)}</h3>

            <div className="d-flex justify-content-end">
              <Link
                to={{ pathname: `/docs/${state.data?.id}` }}
                className="btn btn-primary lh-24 col-md-12 px-3 d-flex align-items-center justify-content-between"
              >
                {Lang.get("GoDocs")}
                <i className="feather feather-chevron-right fs-20 " />
              </Link>
              <div className="col-md-7 pr-0">
                <button
                  className="btn btn-success btn-block lh-24 px-3"
                  onClick={() => getUpdate()}
                >
                  {Lang.get("Save")}
                </button>
              </div>
            </div>
          </div>
        }
      >
        {/* Content */}
        <div style={{ minHeight: 400 }}>
          {state.loading && <Loading />}

          <Tabs
            selectedTab={state.activeTab}
            onChange={(activeTab) => setState({ activeTab: activeTab })}
          >
            {TABS.filter((tab) => !!tab.permission).map((item, index) => (
              <Tab label={item.title} value={item.key} key={index} />
            ))}
          </Tabs>
          <div className="position-relative mt-3">
            {state.loading && <Loading />}
            {TABS.filter((tab) => !!tab.permission).map((item, index) => (
              <TabPanel
                value={state.activeTab}
                selectedIndex={item.key}
                key={index}
              >
                {item.component}
              </TabPanel>
            ))}
          </div>
        </div>
      </Popup>
    </ErrorBoundary>
  );
};
