import React from 'react';
import {JsonEditor, MyComp, TestApi} from "@components";
import { projectsData} from "@actions";
import {JsonModal} from "../forms";
import {Select, Checkbox} from "antd";
import classNames from "classnames";
import {Popup, ErrorBoundary, Loading, useModal, App} from 'fogito-core-ui';
import {Lang} from "@plugins";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export const DocsEdit = (props) => {

    const modal = useModal()
    let {refreshInfo, state, setState, status, setStatus, params, setParams} = props;

    const getList = async () => {
        let response = await projectsData()
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
            key: 'description',
            title: 'Description',
            component: <Desc state={state} setState={setState} />,
        },
        {
            key: 'params',
            title: 'Parameters',
            component: <Params state={state} setState={setState} status={status} setStatus={setStatus} params={params} setParams={setParams} />,
        },
        {
            key: 'settings',
            title: 'Responses',
            component: <Settings {...props} state={state}  />,
        },
    ]


    return (
        <ErrorBoundary>
            {/* Modals */}
            <Popup
                show={modal.modals.includes("jsonModal")}
                title={Lang.get("Json format")}
                size={'md'}
                onClose={() => modal.hide("jsonModal")}
            >
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
                onClose={() => modal.hide("testApi")}
            >
                <TestApi
                    onClose={()=> modal.show('testApi')}
                    state={state}
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
                    <a href={`/frame/docs/api/${state.pro_id}/${state.docs_id}`}
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


const Params = ({ state, setState, status, setStatus, params, setParams }) => {

    const onStatus = (e) => {
        switch (e.target.checked) {
            case false:
                setStatus({...status, label: 'Closed', value: 3})
                setState({...state, data: {...state.data, status: 3}})
                break;
            case true:
                setStatus({...status, label: 'Active', value: 1})
                setState({...state, data: {...state.data, status: 1}})
                break;
        }
    }

    return (
        <ErrorBoundary>
            <label className='parent__label mt-2' >{Lang.get("Parameters")}</label>
            <div className='row' >
                {/*<MyComp*/}
                {/*    param={params.parameters}*/}
                {/*    setParam={setParams}*/}
                {/*/>*/}
                <JsonEditor
                    state={state}
                    setState={setState}
                />
            </div>

            <div className='row' >
                <div className='col' >
                    <div className='row px-2 mt-3' >
                        <label>{Lang.get("Title")}<span className='text-danger fs-18 ml-1' >*</span></label>
                        <input className='form-control'
                               placeholder={Lang.get('Title')}
                               value={state.data.title}
                               onChange={(e) => setState({...state, data: {...state.data, title: e.target.value}})}
                        />
                    </div>

                    <div className='row px-2 mt-3' >
                        <label>{Lang.get("ApiUrl")}<span className='text-danger fs-18 ml-1' >*</span></label>
                        <input className='form-control'
                               placeholder={Lang.get('ApiUrl')}
                               value={state.data.url}
                               onChange={(e) => setState({...state, data: {...state.data, url: e.target.value}})}
                        />
                    </div>

                    <div className='row mt-3' style={{ margin:'0' }} >
                        <label>{Lang.get("Methods")}<span className='text-danger fs-18 ml-1' >*</span></label>
                        <Select mode="tags"
                                allowClear
                                style={{ width: '100%' }}
                                placeholder=""
                                value={state.data.methods?.length ? state.data.methods : []}
                                options={state.options}
                                onChange={(e) => {
                                    setState({...state, data: {...state.data, methods: e}})
                                }}
                        />
                    </div>

                    <div className='row px-2 mt-3' >
                        <label>{Lang.get("Slug")}</label>
                        <input className='form-control'
                               placeholder={Lang.get('Slug')}
                               value={state.data.slug}
                               onChange={(e) => setState({...state, data: {...state.data, slug: e.target.value}})}
                        />
                    </div>

                    <div className='mb-2 mt-3 d-flex flex-column w-25' >
                        <label className='label mb-1' >{Lang.get("Status")}</label>
                        <Checkbox checked={status.value === 1 && true} onChange={(e)=> onStatus(e)} >
                            {status.value === 1 ? 'Active' : null}
                        </Checkbox>
                    </div>

                </div>
            </div>
        </ErrorBoundary>
    )
}

const Desc = ({state, setState}) => {

    return (
        <ErrorBoundary>
            {/* Text Editor */}
            <label className='parent__label mt-4' >
                {Lang.get("Description")}
            </label>
            <div className='w-100 mb-4' style={{ borderRadius:10 }}  >
                <CKEditor
                    editor={ ClassicEditor }
                    data={state.data.description}
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        console.log( { event, editor, data } )
                        setState({...state, data: {...state.data, description: data}})
                    }}
                    style={{
                      "border": "1px solid blue"
                    }}
                />
            </div>
        </ErrorBoundary>
    )
}

const Settings = ({state}) => {
    return(
        <ErrorBoundary>
            {/* Json Response */}
            {!!state.proxyData.length && <label className='parent__label mt-4'>{Lang.get("Response Examples")}</label>}
            <div className='row' >
                <div className='col' >
                    {
                        state.proxyData.length
                            ?
                            <div className='response-card' >
                                {
                                    !!state.proxyData && state.proxyData.map((row,i) =>
                                        <code key={i} >
                                        <pre className='fs-14'>
                                            <div style={{lineHeight: 1.3}} dangerouslySetInnerHTML={App.getData().createMarkup(App.getData().jsonDesign(row.response))}/>
                                        </pre>
                                        </code>
                                    )
                                }
                            </div>
                            :
                            <div className='d-flex justify-content-center align-items-center flex-column pt-5' >
                                <img src='/frame/docspanel/assets/icons/empty.svg' alt='' />
                                <p className='text-muted mt-3' >{Lang.get('NotYet')}</p>
                            </div>
                    }
                </div>
            </div>
        </ErrorBoundary>
    )
}

