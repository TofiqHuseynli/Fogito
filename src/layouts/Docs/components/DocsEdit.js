import React from 'react';
import { TestApi } from "@components";
import { workspacesData} from "@actions";
import {JsonModal} from "../forms";
import classNames from "classnames";
import {Popup, ErrorBoundary, Loading, useModal, Lang,} from 'fogito-core-ui';
import {Responses} from "@layouts/Docs/Responses";
import {Request} from "@layouts/Docs/Request";
import {Content} from "@layouts/Docs/Content";

export const DocsEdit = (props) => {

    const modal = useModal()
    let {refreshInfo, state, setState, status, setStatus, params, setParams} = props;

    const getList = async () => {
        let response = await workspacesData()
        if (response.status === 'success') {
            setState({
                status_data: response.data.status,
                public_data: response.data.public,
            })
        }
    }

    React.useEffect(()=> {
        window.scrollTo(0,0);
        refreshInfo()
    },[state.docs_id])

    React.useEffect(()=> {
        getList()
    },[])

    const TABS = [
        {
            key: 'params',
            title: 'Request',
            component: <Request state={state} setState={setState} status={status} setStatus={setStatus} params={params} setParams={setParams} />,
        },
        {
            key: 'description',
            title: 'Content',
            component: <Content state={state} setState={setState} />,
        },
        {
            key: 'settings',
            title: 'Responses',
            component: <Responses {...props} id={state.docs_id} project_id={state.id} />,
        },
    ]


    return (
        <ErrorBoundary>
            {/* Modals */}
            <Popup
                show={modal.modals.includes("jsonModal")}
                title={Lang.get("Json format")}
                size={'md'}
                onClose={() => modal.hide("jsonModal")}>
                    <JsonModal
                        setState={setState}
                        id={state.docs_id}
                        state={state}
                        onClose={() => modal.hide("jsonModal")}
                    />
            </Popup>
            <Popup
                show={modal.modals.includes("testApi")}
                title={Lang.get("Simple Request")}
                size={'xl'}
                onClose={() => modal.hide("testApi")}>
                <TestApi
                    onClose={()=> modal.show('testApi')}
                    id={state.docs_id}
                    project_id={state.id}
                    url={state.data?.url}
                    parameters={state.data?.parameters}
                    methods={state.data?.methods}
                />
            </Popup>

            {/* TABS */}
            <div className='d-flex justify-content-between' >
                <div className='docs__tab' >
                    {TABS.map((item,i) =>
                        <button
                            key={i}
                            className={classNames("tab_item",{active: state.tab === item.key})}
                            onClick={()=> setState({tab: item.key})}
                        >
                            {Lang.get(item.title)}
                        </button>
                    )}
                </div>

                <div className='go_docs__button' >
                    <button className='btn options-btn mt-1' onClick={()=> modal.show('testApi')} >
                        <i className='feather feather-play text-primary' />
                    </button>
                    <button className='btn options-btn mt-1' onClick={()=> modal.show('jsonModal')} >
                        <i className='feather feather-file-text text-primary' />
                    </button>
                    <a href={`/service/adocs/api/${state.pro_id}/${state.docs_id}`}
                       target='_blank'
                       className='btn options-btn mt-1' >
                        {Lang.get("GoDocs")}
                    </a>
                </div>
            </div>

            {/* Content */}
            {state.loading && <Loading />}
            <div className='form-group' >
                {TABS.find(x => x.key === state.tab)?.component}
            </div>
        </ErrorBoundary>
    )
}


