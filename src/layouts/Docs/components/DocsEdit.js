import React from 'react';
import {CustomModal, ErrorBoundary, Inputs, JsonEditor, Loading} from "@components";
import {apisDelete, apisInfo, projectsData} from "@actions";
import {Editor} from "@tinymce/tinymce-react";
import {OptionsBtn} from "../forms";
import {App, Lang} from "@plugins";
import {Select} from "antd";
import {Duplicate} from "./Duplicate";
import {MoveModal} from "./MoveModal";


export const DocsEdit = (props) => {

    const [duplicate, setDuplicate] = React.useState(false)
    const [move, setMove] = React.useState(false)
    let {refresh, state, setState} = props;

    const refreshInfo = async () => {
        setState({loading: true, stat: false})
        let id = state.docs_id;
        let response = await apisInfo({id})
        if (response.status === 'success') {
            setState({
                data: response.data,
                jsonValue: response.data.parameters,
                loading: false,
                stat: 'success'
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

    async function onDelete() {
        setState({loading: true})
        let id = state.docs_id
        let response = await apisDelete({id})
        if (response.status === 'success') {
            setState({loading: false, docs_id: ''})
            props.history.push(`/docs/${state.id}`)
            refresh()
        } else {
            App.errorModal(response.description)
        }
    }

    React.useEffect(()=> {
        state.docs_id && refreshInfo()
    },[state.docs_id])

    React.useEffect(()=> {
        getList()
    },[])


    return (
        <ErrorBoundary>
            {/* Modals */}
            <CustomModal
                show={duplicate}
                title={Lang.get('Duplicate')}
                onHide={()=> setDuplicate(false)}
            >
                <Duplicate onHide={()=> setDuplicate(false)} />
            </CustomModal>
            <CustomModal
                show={move}
                title={Lang.get('Move')}
                onHide={()=> setMove(false)}
            >
                <MoveModal
                    onHide={()=> setMove(false)}
                    setState={setState}
                    id={state.docs_id}
                    state={state}
                />
            </CustomModal>

            {/*** TABS ***/}
            <div className='docs__tab' >
                <button className={`${state.tab === 'json' ? 'active' : ''}`} onClick={()=> setState({tab: 'json'})} >
                    {Lang.get("Parameters")}
                </button>
                <button className={`${state.tab === 'desc' ? 'active' : ''}`} onClick={()=> setState({tab: 'desc'})} >
                    {Lang.get("Description")}
                </button>
                <button className={`${state.tab === 'actions' ? 'active' : ''}`} onClick={()=> setState({tab: 'actions'})} >
                    {Lang.get("Generations")}
                </button>
            </div>

            {/* Content */}
            {state.loading && <Loading />}

            <div className='form-group' >
                {
                    state.tab === 'json' &&
                        <>
                            {/* Json Editor */}
                            <label className='parent__label mt-2' >{Lang.get("Parameters")}</label>
                            <div className='row' >
                                <JsonEditor
                                    state={state}
                                    setState={setState}
                                />
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
                }

                {
                    state.tab === 'desc' &&
                    <>
                        {/* Text Editor */}
                        <label className='parent__label mt-4' >{Lang.get("Description")}</label>
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
                }


                {
                    state.tab === 'actions' &&
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
                                    <Inputs type='select'
                                            onSelect={(e) => setState({...state, data: {...state.data, status: parseInt(e.target.value)}})}
                                            data={state.status_data}
                                            propsClass={'custom-input'}
                                            divClass={'row px-2 mt-3'}
                                            selected={state.data.status?.value}
                                            label={'Status'}
                                    />

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
                                    <Inputs type='select'
                                            onSelect={(e) => setState({...state, data: {...state.data, public: parseInt(e.target.value)}})}
                                            data={state.public_data}
                                            propsClass={'custom-input'}
                                            divClass={'row px-2 mt-3'}
                                            selected={state.data.public?.value}
                                            label={"Public"}
                                    />
                                </div>

                                {/* Actions */}
                                <div className='col-md-4' >
                                    <div className='px-2 text-primary row' style={{ marginTop: 41 }} >
                                        <a href={`https://apptest.fogito.com/frame/docs/api/${state.project_id}/${state.docs_id}`} target='_blank' className='btn options-btn' >
                                            {Lang.get("GoDocs")}
                                        </a>
                                    </div>
                                    {/*<OptionsBtn*/}
                                    {/*    divClassName='px-2 row'*/}
                                    {/*    style={{ marginTop: 20 }}*/}
                                    {/*    title={'Duplicate'}*/}
                                    {/*    // onClick={()=> setDuplicate(true)}*/}
                                    {/*/>*/}
                                    {/*<OptionsBtn*/}
                                    {/*    divClassName='px-2 row'*/}
                                    {/*    style={{ marginTop: 20 }}*/}
                                    {/*    title={'Move'}*/}
                                    {/*    // onClick={()=> setMove(true)}*/}
                                    {/*/>*/}
                                    <OptionsBtn
                                        divClassName='px-2 text-danger row'
                                        style={{ marginTop: 20 }}
                                        onClick={()=> App.deleteModal(()=> onDelete() )}
                                        title={'Delete'}
                                    />
                                </div>
                            </div>
                        </>
                }

                    </div>
        </ErrorBoundary>
    )
}