import React from 'react';
import {apisDelete, apisMove, apisUpdate, documentationStripe} from "@actions";
import {ErrorBoundary, Header, Popup} from "@components";
import {DocsEdit, DocsStripe} from "./components";
import {App, Auth, Lang} from "@plugins";
import {Add} from "./components";
import {useModal} from "@hooks";
import {genUuid, inArray} from "@lib";
import {API_ROUTES} from "@config";

export const Docs = (props) => {

    let xhr = [];
    const modal = useModal()
    const initialState = {
        docs_id: props.match.params.docs_id,
        id: props.match.params.id,
        _id: '',
        pro_id: props.match.params.id,

        status_data: [],
        public_data: [],
        docs: [],
        file: {  },

        options: [
            { value: 'get',       label: 'get' },
            { value: 'post',      label: 'post' },
            { value: 'put',       label: 'put' },
            { value: 'delete',    label: 'delete' },
            { value: 'multipart', label: 'multipart' }
        ],
        data: {
            title: "",
            slug: "",
            description: "",
            parameters: [],
            parameters_note: {},
            url: "",
            methods: [],
            index: "",
            status: null,
            public: ''
        },

        perms_modal: false,
        loading: false,
        loadingStripe: false,
        tab: 'params',
        jsonValue: ''
    };

    //  actions
    const [state, setState] = React.useReducer((prevState, newState) => {
        return {...prevState, ...newState};
    }, initialState);


    async function onDragEnd(data) {
        const url = 'dataMove';
        const obj = {
            id: data.draggedNodeData.id,
            project_id: state.pro_id,
            parent_id: (data.position === "Inside") ? data.droppedNodeData.id : data.droppedNodeData.parentID,
            position: data.dropIndex + 1
        };
        await apisMove(url, obj);
    }

    async function onDelete(id) {
        let response = await apisDelete({id})
        if(response.status === 'success') {
            refresh()
        }
    }

    async function refresh() {
        setState({ loadingStripe: true })
        let project_id = state.pro_id
        let response = await documentationStripe({project_id})
        if(response.status === 'success') {
            setState({
                project_id: response.data.project_id,
                docs: response.data.list,
                loadingStripe: false
            })
        }
    }

    const getUpdate = async () => {
        let response = await apisUpdate({
            id: state.pro_id,
            data: state.data
        })
        setState({loading:true });
        if (response.status === 'success') {
            setState({
                success: response.description,
                error: false,
                loading: false
            });
            App.successModal(response.description)
            refresh()
        } else {
            setState({
                error: response.description,
                loading: false
            })
            App.errorModal(response.description);
        }
    }

    const sendFormData = ({ key, data, target }) => {
        xhr[key] = new XMLHttpRequest();

        xhr[key].addEventListener("load", function (e) {
            let response = JSON.parse(e.target.responseText);
            if(response.status === 'success') {
                refresh()
            } else {
                App.errorModal(response.description)
            }
        });

        xhr[key].open("POST", API_ROUTES["apisImport"], true);
        xhr[key].send(data);
    };

    const onFileSelect = (e, target) => {
        let { pro_id } = state;
        for (let file of e.target.files) {
            let key = genUuid();
            file.loading = true;
            file.key = key;

            let formData = new FormData();
            formData.append("token", Auth.get("token"));
            formData.append("project_id", pro_id);
            formData.append("file", file);
            sendFormData({
                key,
                data: formData,
                target,
            });
        }
    };


    React.useEffect(()=> {
        refresh()
    },[])


    return (
        <ErrorBoundary>
            {/** Docs Add Modal **/}
            <Popup
                show={inArray("add", modal.modals)}
                title={Lang.get("AddDocs")}
                onClose={() => modal.hide("add")}
            >
                <Add
                    _id={state.pro_id}
                    type={'add_docs'}
                    refresh={() => refresh()}
                    onClose={() => modal.hide("add")}
                />
            </Popup>

            {/*** Header ***/}
            <Header>
                <div className="col d-flex justify-content-between align-items-center px-0">

                    <div className='col-3 mx-3' />

                    <div className="col-md-1 pl-0">
                        <button
                            className="btn btn-lightblue text-white lh-24 px-3 text-center"
                            onClick={() => props.history.push('/projects')}
                        >
                            <i className="feather feather-chevron-left fs-22 align-middle" />
                        </button>
                    </div>

                    <h3 className='text-primary mx-auto' >{Lang.get(state.data.title)}</h3>

                    <>
                        <div className="col-md-1 pr-0">
                            <input
                                className="btn btn-lightblue text-white btn-block custom-file-input lh-24 px-3"
                                onChange={(e) => onFileSelect(e, "file")}
                                type={'file'}
                                accept=".doc,.docx,.txt,.fog"
                            />
                        </div>
                        <div className="col-md-1 pr-0">
                            <a
                                className="btn btn-lightblue btn-block lh-24 px-3"
                                href={
                                    `https://docs.fogito.com/apis/export?token=${Auth.get("token")}&lang=${Auth.get("lang")}&project_id=${state.pro_id}`
                                }
                                target="_blank"
                                download
                            >
                                {Lang.get("Export")}
                            </a>
                        </div>
                        <div className="col-md-2 pr-0">
                            <button
                                className="btn btn-success btn-block lh-24 px-3"
                                onClick={() => getUpdate()}
                            >
                                {Lang.get("Save")}
                            </button>
                        </div>
                    </>
                </div>
            </Header>
            {/*** Content ***/}
            <section className="container-fluid position-relative pb-1">
                <div className="d-flex flex-md-row flex-column col">

                    {/* Docs Sidebar */}
                    <div className='card docs__sidebar col-md-3 p-0 m-0 mb-4' >
                        <button
                            className="btn btn-primary d-flex align-items-center
                            justify-content-center btn-block lh-24  mt-4 mb-2 mx-auto"
                            onClick={() => modal.show("add")}
                            style={{ maxWidth:'20rem' }}
                        >
                            <i className="feather feather-plus fs-18 align-middle mr-1" />
                            {Lang.get("Add")}
                        </button>
                        <DocsStripe state={state}
                                    setState={setState}
                                    onDragEnd={onDragEnd}
                                    onDelete={onDelete}
                                    refresh={() => refresh()}
                                    openAddSubModal={() => modal.show("add_sub")}
                        />
                    </div>

                    {/* Docs Content */}
                    <div className='col docs__content' >
                        <div className='card col-md-9 p-3' style={{ minHeight:630 }} >
                            {
                                state.docs_id
                                ?
                                <DocsEdit
                                    {...props}
                                    _id={state.docs_id}
                                    state={state}
                                    setState={setState}
                                    refresh={() => refresh()}
                                    getUpdate={()=> getUpdate()}
                                />
                                :
                                <div className='d-flex flex-column justify-content-center align-items-center pt-5 mt-5' >
                                    <img src='/frame/docspanel/assets/icons/docs.svg' style={{ width: 120, opacity: .4 }} />
                                    <button
                                        className="btn btn-secondary text-primary w-25 lh-24 px-3 mt-3"
                                        onClick={() => modal.show("add")}
                                    >
                                        {Lang.get("Add")}
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </section>
        </ErrorBoundary>
    )
}