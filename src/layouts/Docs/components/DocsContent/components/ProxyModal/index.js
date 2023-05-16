import React from "react";
import {ErrorBoundary, Loading,Lang,} from "fogito-core-ui";
import {prepareText, sendRequest, getDefaultMethod} from "./actions";
import Select from "react-select";
import {Parameters} from "@plugins";
import {
    GeneralTab,
    SettingsTab,
} from "./components";
import {Tab, TabPanel, Tabs} from "@components";

export const ProxyModal = ({parentState}) => {
    const initialState = {
        loading: false,
        loadingResponse: false,
        activeTab:'general',
        id: parentState.docs_id,
        workspace_id: parentState.workspace_id,
        url: parentState.data?.url,
        projectUrl: parentState.data?.url,
        method: getDefaultMethod(parentState.data?.methods),
        raw: prepareText(parentState.data?.parameters),
        headers:parentState.data?.headers || [],
        cookies:parentState.data?.cookies || [],
        request: {url: false},
        response:'',
    }
    const [state, setState] = React.useReducer((prevState, newState) => {
        return {...prevState, ...newState};
    }, initialState);


    const TABS = [
        {
            key: 'general',
            title: 'Body',
            permission: true,
            component: <GeneralTab state={state} setState={setState}/>,
        },
        {
            key: 'headers',
            title: 'Headers',
            permission: true,
            component: <SettingsTab
                data={state.headers}
                setData={(data) => {setState({headers: data})}}
                title={Lang.get('Headers')}
            />,
        },
        {
            key: 'cookies',
            title: 'Cookies',
            permission: true,
            component: <SettingsTab
                data={state.cookies}
                setData={(data) => {setState({cookies: data})}}
                title={Lang.get('Cookies')}
            />,
        },
    ]



    return(
        <ErrorBoundary>
            {state.loading && <Loading />}
            <div className='proxy-container' >
                <div className='row' >
                    <div className='col' >
                        <label>{Lang.get("Url")}</label>
                        <div className="d-flex">
                            <div style={{width:110,zIndex:100}}>
                                <Select
                                    className='form-control mr-1 w-auto'
                                    value={state.method}
                                    options={Parameters.getRequestMethods()}
                                    onChange={method => setState({method})}
                                />
                            </div>
                            <input
                                className="form-control mr-1"
                                placeholder={Lang.get("Url")}
                                value={state.url}
                                onChange={(e) => setState({url: e.target.value})}
                            />
                            <div className="input-group-append">
                                <i className='feather feather-play btn btn-success' onClick={()=> sendRequest(state, setState)} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-0 tab-list mt-2">
                    <Tabs
                        selectedTab={state.activeTab}
                        onChange={(activeTab) => setState({activeTab})}>
                        {TABS.filter((tab) => !!tab.permission).map((item, index) => (
                            <Tab label={item.title} value={item.key} key={index}/>
                        ))}
                    </Tabs>
                </div>
                <div className="position-relative mt-2">
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
        </ErrorBoundary>
    )
}
