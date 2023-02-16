import React from "react";
import {Spinner} from "@components";
import {workspacesInfo, workspacesUpdate} from "@actions";
import {General, GlobalVariables, Permission} from "./components";
import {Link} from "react-router-dom";
import {
    Popup,
    ErrorBoundary,
    Loading,
    useToast,
    Lang
} from "fogito-core-ui";
import {Tab, TabPanel, Tabs} from "@components";

export const Edit = ({match, onClose, reload}) => {

    const toast = useToast();

    const [state, setState] = React.useReducer(
        (prevState, newState) => ({...prevState, ...newState,}), {
            id: match?.params?.id,
            loading: true,
            saveLoading: false,
            updated: false,
            reload_required: false,
            activeTab: "general",
            status_data: [],
            public_data: [],
            members: {},
            params: {
                id: match?.params?.id,
                title: "",
                slug: "",
                description: "",
                api_url: "",
                api_path: "",
                status: "",
                public: "",
                global_variables: [],
            }
        });

    const setParams = (data) =>{
        setState({params: {...state.params,...data}})
    }

    const loadData = async () => {
        setState({loading: true});
        let id = state.id;
        let response = await workspacesInfo({id});
        if (response.status === "success") {
            setState({
                loading: false,
                params: {...response.data},
                members: response.data.members,
            });
        }
    };

    const onSubmit = async () => {
        setState({saveLoading: true});
        if (!state.saveLoading) {
            let response = await workspacesUpdate({
                ...state.params,
                status: state.params.status?.value,
            });

            if (response) {
                setState({
                    saveLoading: false,
                    reload_required: true,
                });
                toast.fire({
                    title: response.description,
                    icon: response.status,
                });
            }
        }
    };

    const goBack = () => {
        if (typeof onClose === 'function') {
            onClose();
        } else {
            history.push('/workspaces');
        }
        if (state.reload_required) {
            reload();
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
            component: <General
                state={state}
                setParams={setParams}
            />,
        },
        {
            key: "global_variables",
            title: "GlobalVariables",
            permission: true,
            component: <GlobalVariables
                variables={state.params?.global_variables || []}
                setVars={(global_variables) => setParams({global_variables})}
            />,
        },
        {
            key: "permission",
            title: "Permission",
            permission: true,
            component: <Permission workspace_id={state.id} tab={state.activeTab}/>,
        },
    ];

    return (
        <ErrorBoundary>
            <Popup
                show
                size="xl"
                onClose={goBack}
                header={
                    <div className="d-flex align-items-center justify-content-between w-100">
                        <button
                            className="btn btn-primary lh-24 px-3 text-center"
                            onClick={goBack}
                        >
                            <i className="feather feather-chevron-left fs-20 "/>
                        </button>

                        <h3 className="text-primary">{Lang.get('Edit')}</h3>

                        <div className="d-flex justify-content-end">
                            <Link
                                className="btn btn-primary"
                                to={{pathname: `/docs/${state.id}`}}
                            >
                                {Lang.get("GoDocs")}
                            </Link>
                            <div className="pr-0">
                                <button
                                    className="btn btn-success"
                                    onClick={onSubmit}
                                >
                                    {state.saveLoading ? (
                                        <Spinner color="#fff" style={{width: 30}}/>) : (Lang.get("Save"))}
                                </button>
                            </div>
                        </div>
                    </div>
                }
            >
                {state.loading && <Loading/>}

                <div style={{minHeight: 400}}>
                    <Tabs
                        selectedTab={state.activeTab}
                        onChange={(activeTab) => setState({activeTab})}>
                        {TABS.filter((tab) => !!tab.permission).map((item, index) => (
                            <Tab label={item.title} value={item.key} key={index}/>
                        ))}
                    </Tabs>
                    <div className="position-relative mt-3">
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
