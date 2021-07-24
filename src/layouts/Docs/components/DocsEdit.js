import React from 'react';
import {ErrorBoundary, Inputs, JsonEditor, Loading, Popup} from "@components";
import {apisCopy, apisDelete, apisInfo, projectsData} from "@actions";
import {Editor} from "@tinymce/tinymce-react";
import {JsonModal, OptionsBtn, TestApi} from "../forms";
import {App, Lang} from "@plugins";
import {Select, Radio, Checkbox} from "antd";
import {inArray} from "@lib";
import {useModal} from "@hooks";
import classNames from "classnames";


export const DocsEdit = (props) => {

    const modal = useModal()
    let {refresh, state, setState} = props;

    const refreshInfo = async () => {
        setState({loading: true})
        let id = state.docs_id;
        let response = await apisInfo({id})
        if (response.status === 'success') {
            setState({
                data: response.data,
                jsonValue: response.data.parameters,
                loading: false,
            })
        }
        setState({ loading: false })
    }

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
        refreshInfo()
        window.scrollTo(0,0);
        setState({ tab: 'params' })
    },[state.docs_id])

    React.useEffect(()=> {
        getList()
    },[])

    const TABS = [
        {
            key: 'description',
            title: 'Description',
            component: <Desc state={state} setState={setState} />
        },
        {
            key: 'params',
            title: 'Parameters',
            component: <Params state={state} setState={setState} />
        },
        {
            key: 'settings',
            title: 'Settings',
            component: <Settings {...props} state={state} setState={setState} refresh={refresh} />
        },
    ]


    return (
        <ErrorBoundary>
            {/* Modals */}
            <Popup
                show={inArray("jsonModal", modal.modals)}
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
                show={inArray("testApi", modal.modals)}
                title={Lang.get("Simple Request")}
                size={'md'}
                onClose={() => modal.hide("testApi")}
            >
                Coming Soon!
                {/*<TestApi*/}
                {/*    onClose={()=> modal.show('testApi')}*/}
                {/*    state={state}*/}
                {/*/>*/}
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
                    <a href={`/frame/docs/api/${state.project_id}/${state.docs_id}`}
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


const Params = ({ state, setState }) => {
    return (
        <>
            <label className='parent__label mt-2' >{Lang.get("Parameters")}</label>
            <div className='row' >
                {
                    <JsonEditor
                        state={state}
                        setState={setState}
                    />
                }
            </div>

            {/* Json Response */}
            <div className='row' >
                <div className='col' >
                    <Inputs type='text-area'
                            onChange={(e) => setState({...state, data: {...state.data, parameters_note: e.target.value}})}
                            value={state.data.parameters_note}
                            propsClass={'custom-input'}
                            divClass={'row px-2 mt-3'}
                            placeholder={'Response'}
                            label={'Response (example)'}
                            style={{ minHeight: 250 }}
                    />
                </div>
            </div>
        </>
    )
}

const Desc = ({state, setState}) => {
    const [loading, setLoading] = React.useState(true)

    setTimeout(()=> {
        setLoading(false)
    },2000)

    return (
        <>
            {/* Text Editor */}
            <label className='parent__label mt-4' >
                {Lang.get("Description")}{loading && Lang.get(' - Loading...')}
            </label>
            <div className='w-100 mb-4' style={{ borderRadius:10 }}  >
                <Editor
                    style={{ borderRadius:10 }}
                    onEditorChange={(content)=> setState({...state, data: {...state.data, description: content}})}
                    apiKey='82nbg8ctqdxe6wzh685u0inzhlffhw2yr10iptjmngucrniy'
                    value={state.data.description}
                    init={{
                        height: 300,
                        menubar: false,
                        plugins: [
                            'advlist autolink link image lists charmap print preview hr anchor pagebreak',
                            'searchreplace wordcount visualblocks code fullscreen insertdatetime media nonbreaking',
                            'table emoticons template paste help'
                        ],
                        toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | ' +
                            'bullist numlist outdent indent | link image | print preview media fullpage | ' +
                            'forecolor backcolor emoticons | help',
                    }}
                />
            </div>
        </>
    )
}

const Settings = (props) => {

    let {state, setState, refresh} = props;
    const [status, setStatus] = React.useState({
        label: state.data.status?.label,
        value: state.data.status?.value,
        dex: state.data.status?.dex
    })

    async function onDelete() {
        setState({loading: true})
        let id = state.docs_id
        let response = await apisDelete({id})
        if (response.status === 'success') {
            setState({loading: false, docs_id: ''})
            props.history.push(`/docs/${state.id}`)
            refresh(false)
        } else {
            App.errorModal(response.description)
        }
    }

    async function onDuplicate() {
        let response = await apisCopy({
            id: state.data?.id,
            project_id: state.data?.project_id,
            parent_id: state.data?.parent_id,
            position: "0"
        })
        if(response.status === 'success') {
            refresh(false)
        }
        else {
            App.errorModal(response.description)
        }
    }

    const onStatus = () => {
        switch (status.value) {
            case 1:
                setStatus({...status, label: 'Closed', value: 3})
                setState({...state, data: {...state.data, status: 3}})
                break;
            case 3:
                setStatus({...status, label: 'Active', value: 1})
                setState({...state, data: {...state.data, status: 1}})
                break;
        }
    }


    return (
        <>
            {/* Form */}
            <div className='row' >
                <div className='col-md-8' >
                    <Inputs type='input'
                            onChange={(e) => setState({...state, data: {...state.data, title: e.target.value}})}
                            value={state.data.title}
                            propsClass={'custom-input'}
                            divClass={'row px-2 mt-3'}
                            placeholder={'Title'}
                            label={'Title'}
                    />

                    {/*<Inputs type='select'*/}
                    {/*        onSelect={(e) => setState({...state, data: {...state.data, status: parseInt(e.target.value)}})}*/}
                    {/*        data={state.status_data}*/}
                    {/*        propsClass={'custom-input'}*/}
                    {/*        divClass={'row px-2 mt-3'}*/}
                    {/*        selected={state.data.status?.value}*/}
                    {/*        label={'Status'}*/}
                    {/*/>*/}

                    <Inputs type='input'
                            onChange={(e) => setState({...state, data: {...state.data, url: e.target.value}})}
                            value={state.data.url}
                            propsClass={'custom-input'}
                            divClass={'row px-2 mt-3'}
                            label={'ApiUrl'}
                            placeholder={'ApiUrl'}
                    />
                    <div className='row mt-3' style={{ margin:'0' }} >
                        <label className='label' >{Lang.get("Methods")}</label>
                        <Select mode="tags"
                                allowClear
                                style={{ width: '100%' }}
                                placeholder=""
                                defaultValue={state.data.methods}
                                options={state.options}
                                onChange={(e) => {
                                    setState({...state, data: {...state.data, methods: e}})
                                }}
                        />
                    </div>
                    <Inputs type='input'
                            onChange={(e) => setState({...state, data: {...state.data, slug: e.target.value}})}
                            value={state.data.slug}
                            propsClass={'custom-input'}
                            divClass={'row px-2 mt-3'}
                            label={'Slug'}
                            placeholder={'Slug'}
                    />
                    {/*<Inputs type='select'*/}
                    {/*        onSelect={(e) => setState({...state, data: {...state.data, public: parseInt(e.target.value)}})}*/}
                    {/*        data={state.public_data}*/}
                    {/*        propsClass={'custom-input'}*/}
                    {/*        divClass={'row px-2 mt-3'}*/}
                    {/*        selected={state.data.public?.value}*/}
                    {/*        label={"Public"}*/}
                    {/*/>*/}
                </div>

                {/* Actions */}
                <div className='col-md-4' >
                    <OptionsBtn
                        divClassName='px-2 text-danger row'
                        style={{ marginTop: 41 }}
                        onClick={()=> App.deleteModal(()=> onDelete() )}
                        title={'Delete'}
                    />
                    <OptionsBtn
                        style={{ marginTop: 20 }}
                        divClassName='px-2 text-primary row'
                        title={'Duplicate'}
                        onClick={()=> App.duplicateModal(()=> onDuplicate())}
                    />
                    <OptionsBtn
                        style={{ marginTop: 20, color: status.value === 3 ? '#2dce89' : '#22BBD6' }}
                        divClassName='px-2 row'
                        title={status.value === 3 ? 'Active' : 'Closed'}
                        onClick={()=> onStatus()}
                    />
                </div>
            </div>
        </>
    )
}