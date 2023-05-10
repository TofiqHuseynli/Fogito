import React from 'react';
import {Popup, ErrorBoundary, Loading, useModal, Lang,} from 'fogito-core-ui';
import {JsonModal, GeneralTab, InfoTab, ResponseTab, ProxyModal, HeadersTab, CookiesTab} from "./components";
import {Tab, TabPanel, Tabs} from "@components";

export const DocsContent = ({state, setState}) => {

    const modal = useModal()


    const TABS = [
        {
            key: 'general',
            title: 'Request',
            permission: true,
            component: <GeneralTab state={state} setState={setState}/>,
        },
        {
            key: 'headers',
            title: 'Headers',
            permission: true,
            component: <HeadersTab state={state} setState={setState}/>,
        },
        {
            key: 'cookies',
            title: 'Cookies',
            permission: true,
            component: <CookiesTab state={state} setState={setState}/>,
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
            component: <ResponseTab
                id={state.docs_id}
                tab={state.activeTab}
                workspace_id={state.workspace_id}
            />,
        },
    ]


    return (
        <ErrorBoundary>
            {/* Modals */}
            <Popup
                show={modal.modals.includes("json_modal")}
                title={Lang.get("JsonFormat")}
                size={'lg'}
                onClose={() => modal.hide("json_modal")}>
                <JsonModal
                    setState={setState}
                    state={state}
                />
            </Popup>
            <Popup
                show={modal.modals.includes("proxy_modal")}
                title={Lang.get("SimpleRequest")}
                size={'xl'}
                onClose={() => modal.hide("proxy_modal")}>
                <ProxyModal
                    parentState={state}
                />
            </Popup>


            {state.loading && <Loading/>}

            <div className='docs__tab d-flex justify-content-between'>
               <div className="p-0 w-100">
                   <Tabs
                       selectedTab={state.activeTab}
                       onChange={(activeTab) => setState({activeTab})}>
                       {TABS.filter((tab) => !!tab.permission).map((item, index) => (
                           <Tab label={item.title} value={item.key} key={index}/>
                       ))}
                   </Tabs>
               </div>

                <div className='d-flex ml-3'>
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


