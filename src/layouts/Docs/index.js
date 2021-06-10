import React from 'react';
import {apisDelete, apisMove, apisUpdate, documentationStripe} from "@actions";
import {ErrorBoundary, Header, Popup} from "@components";
import {DocsEdit, DocsStripe} from "./components";
import {App, Lang} from "@plugins";
import {Add} from "./components";
import {useModal} from "@hooks";
import {inArray} from "@lib";

export const Docs = (props) => {

    const modal = useModal()

    const initialState = {
        docs_id: props.match.params.docs_id,
        id: props.match.params.id,
        project_id: '',
        _id: '',
        pro_id: props.match.params.id,

        status_data: [],
        public_data: [],
        docs: [],

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
        tab: 'json',
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
        setState({ loading: true })
        let project_id = state.pro_id
        let response = await documentationStripe({project_id})
        if(response.status === 'success') {
            setState({
                project_id: response.data.project_id,
                docs: response.data.list,
                loading: false
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
                    <div className="col-md-1 pl-0 ml-0">
                        <button
                            className="btn btn-primary lh-24 px-3 text-center"
                            onClick={() => props.history.push('/projects')}
                        >
                            <i className="feather feather-chevron-left fs-22 align-middle" />
                        </button>
                    </div>

                    <h3 className='text-primary mx-auto' >{Lang.get(props.name)}</h3>

                    <>
                        <div className="col-md-1 pr-0">
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
                <div className="card d-flex flex-md-row flex-column col">

                    {/* Docs Sidebar */}
                    <div className='docs_sidebar col-md-3 p-0 m-0' >
                        <button
                            className="btn btn-primary d-flex align-items-center
                            justify-content-center btn-block lh-24  mt-4 mb-2 mx-auto"
                            onClick={() => modal.show("add")}
                            style={{ maxWidth:'20rem' }}
                        >
                            <i className="feather feather-plus fs-18 align-middle mr-1" />
                            {Lang.get("New")}
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
                    <div className='col-md-9 p-3' >
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
                            <div className='d-flex justify-content-center flex-column align-items-center py-3' >
                                <h2>{Lang.get("Select docs")}</h2>
                                <button
                                    className="btn btn-secondary w-25 lh-24 px-3 mt-3"
                                    onClick={() => modal.show("add")}
                                >
                                    {Lang.get("Create Docs")}
                                </button>
                            </div>
                        }
                    </div>
                </div>
            </section>
        </ErrorBoundary>
    )
}