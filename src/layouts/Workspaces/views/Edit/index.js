import React from "react";
import {Permissions} from "@components";
import {workspacesInfo, workspacesUpdate} from "@actions";
import {General, GlobalVariablesBox} from "./components";
import {Link} from "react-router-dom";
import {
    Popup,
    ErrorBoundary,
    Loading,
    useToast,
    Lang
} from "fogito-core-ui";
import {Tab, TabPanel, Tabs} from "@components";

export const Edit = ({name, match, history, onClose,reload}) => {

    const [state, setState] = React.useReducer(
        (prevState, newState) => ({...prevState, ...newState,}), {
            id: match?.params?.id,
            loading: false,
            updated: false,
            activeTab: "general",
            permissions_data: [],
            status_data: [],
            public_data: [],
            editor_type: "json",
            employees: {},
            data: {
                id: match?.params?.id,
                title: "",
                slug: "",
                description: "",
                api_url: "",
                api_path: "",
                members: false,
                status: "",
                public: "",
                global_variables: [],
            }
        });

    const toast = useToast();

    const loadData = async () => {
        setState({loading: true});
        let id = state.id;
        let response = await workspacesInfo({id});
        if (response.status === "success") {
            setState({
                loading: false,
                data: {...response.data},
                employees: response.data.members,
            });
        }
    };

    const onSubmit = async () => {
        let response = await workspacesUpdate(state.data);

        if (response) {
            toast.fire({
                title: response.description,
                icon: response.status,
            });

            if (response.status === 'success'){
              reload();
            }
        }
    };

    React.useEffect(() => {
        loadData();
    }, []);

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const TABS = [
        {
            key: "general",
            title: "General",
            permission: true,
            component: <General state={state} setState={setState}/>,
        },
        {
            key: "permissions",
            title: "Permissions",
            permission: true,
            component: (
                <div className="row">
                    <div className="col-md-8">
                        <label>{Lang.get("Permissions")}</label>
                        <Permissions state={state} setState={setState}/>
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
                                <i className="feather feather-chevron-left fs-20 "/>
                            </button>
                        </div>

                        <h3 className="text-primary">{Lang.get(name)}</h3>

                        <div className="d-flex justify-content-end">
                            <Link
                                className="btn btn-primary"
                                to={{pathname: `/docs/${state.data?.id}`}}
                            >
                                {Lang.get("GoDocs")}
                            </Link>
                            <div className="pr-0">
                                <button
                                    className="btn btn-success"
                                    onClick={onSubmit}
                                >
                                    {Lang.get("Save")}
                                </button>
                            </div>
                        </div>
                    </div>
                }
            >
                {/* Content */}
                <div style={{minHeight: 400}}>
                    {state.loading && <Loading/>}

                    <Tabs
                        selectedTab={state.activeTab}
                        onChange={(activeTab) => setState({activeTab: activeTab})}
                    >
                        {TABS.filter((tab) => !!tab.permission).map((item, index) => (
                            <Tab label={item.title} value={item.key} key={index}/>
                        ))}
                    </Tabs>
                    <div className="position-relative mt-3">
                        {state.loading && <Loading/>}
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
