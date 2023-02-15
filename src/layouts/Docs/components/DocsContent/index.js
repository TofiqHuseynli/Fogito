import React from 'react';
import {Popup, ErrorBoundary, Loading, useModal, Lang,} from 'fogito-core-ui';
import {JsonModal, GeneralTab, InfoTab, ResponseTab, ProxyModal} from "./components";
import {Tab, TabPanel, Tabs} from "@components";

export const DocsContent = ({refreshInfo, state, setState}) => {

    const modal = useModal()

    React.useEffect(() => {
        window.scrollTo(0, 0);
        refreshInfo()
    }, [state.docs_id])


    const TABS = [
        {
            key: 'general',
            title: 'Request',
            permission: true,
            component: <GeneralTab state={state} setState={setState}/>,
        },
        {
            key: 'content',
            title: 'Content',
            permission: true,
            component: <InfoTab state={state} setState={setState}/>,
        },
        {
            key: 'responses',
            title: 'Responses',
            permission: true,
            component: <ResponseTab id={state.docs_id} workspace_id={state.workspace_id}/>,
        },
    ]


    return (
        <ErrorBoundary>
            {/* Modals */}
            <Popup
                show={modal.modals.includes("json_modal")}
                title={Lang.get("JsonFormat")}
                size={'md'}
                onClose={() => modal.hide("json_modal")}>
                <JsonModal
                    setState={setState}
                    id={state.docs_id}
                    state={state}
                    onClose={() => modal.hide("json_modal")}
                />
            </Popup>
            <Popup
                show={modal.modals.includes("proxy_modal")}
                title={Lang.get("SimpleRequest")}
                size={'xl'}
                onClose={() => modal.hide("proxy_modal")}>
                <ProxyModal
                    onClose={() => modal.show('proxy_modal')}
                    id={state.docs_id}
                    workspace_id={state.workspace_id}
                    url={state.data?.url}
                    parameters={state.data?.parameters}
                    methods={state.data?.methods}
                />
            </Popup>


            {state.loading && <Loading/>}

            <div className='docs__tab d-flex justify-content-between'>
               <div className="col-6 p-0">
                   <Tabs
                       selectedTab={state.activeTab}
                       onChange={(activeTab) => setState({activeTab})}>
                       {TABS.filter((tab) => !!tab.permission).map((item, index) => (
                           <Tab label={item.title} value={item.key} key={index}/>
                       ))}
                   </Tabs>
               </div>

                <div className="col-4 p-0">
                    <div className='d-flex'>
                        <button className='btn btn-secondary' onClick={() => modal.show('proxy_modal')}>
                            <i className='feather feather-play text-primary'/>
                        </button>
                        <button className='btn btn-secondary' onClick={() => modal.show('json_modal')}>
                            <i className='feather feather-file-text text-primary'/>
                        </button>
                        <a
                            target='_blank'
                            className='btn btn-secondary text-primary'
                            href={`/service/adocs/api/${state.workspace_id}/${state.docs_id}`}
                        >
                            {Lang.get("GoDocs")}
                        </a>
                    </div>
                </div>

            </div>
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
        </ErrorBoundary>
    )
}


