import React from 'react';
import { apisInfo, apisMove, documentationStripe, proxyList} from "@actions";
import {DocsEdit, DocsStripe, HEADER, TestStripe} from "./components";
import {Add} from "./components";
import {useHistory} from 'react-router-dom';
import {
    ErrorBoundary,
    Header,
    useCookie,
    Auth,
    Popup,
    useModal,
    inArray
} from "fogito-core-ui";
import {Lang} from "@plugins";

export const Docs = (props) => {

    const modal = useModal()
    const history = useHistory()
    const cookie = useCookie()
    const initialState = {
        docs_id: props.match.params.docs_id,
        id: props.match.params.id,
        _id: '',
        pro_id: props.match.params.id,

        status_data: [],
        public_data: [],
        docs: [],
        file: {},
        proxyData: [],

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

        initData: [],
        perms_modal: false,
        loading: false,
        loadingStripe: false,
        tab: 'params',
    };

    //  actions
    const [state, setState] = React.useReducer((prevState, newState) => {
        return {...prevState, ...newState};
    }, initialState);

    const [status, setStatus] = React.useState({})
    const [params, setParams] = React.useState({
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
    })

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

    async function refresh() {
        setState({ loadingStripe: true })
        let project_id = state.pro_id
        let response = await documentationStripe({project_id})
        if(response.status === 'success') {
            setState({
                project_id: response.data.project_id,
                docs: response.data,
                loadingStripe: false
            })
        }
    }

    const refreshInfo = async () => {
        setState({loading: true})
        let id = state.docs_id;
        let response = await apisInfo({id})
        if (response.status === 'success') {
            setState({
                data: response.data,
                loading: false,
            })
            setStatus(response.data.status)
            setParams(response.data)
        }
        setState({ loading: false })
    }

    async function refreshWidthFocus() {
        setState({ loadingStripe: true })
        let project_id = state.pro_id
        let response = await documentationStripe({project_id})
        if(response.status === 'success') {
            setState({
                loadingStripe: false
            })
            onFocus(response.data)
        }
    }

    async function loadProxy() {
        setState({loading: true})
        let data = { api_id: state.docs_id }
        let response = await proxyList({data});
        if(response.status === 'success') {
            setState({
                proxyData: response.data,
                loading: false
            })
        }
    }


    React.useEffect(()=> {
        refresh()
    },[])

    React.useEffect(()=> {
        loadProxy()
    },[state.docs_id])

    const onFocus = (data) => {
        cookie.remove('_stripe_id')
        history.push(`/docs/${state?.id}/${data.slice(-1)[0].id}`)
        let row = data.find(x => x.id === data.slice(-1)[0].id)
        let ret = data.map(x => {
                if (x.id === row.id) {
                    let ret = {
                        id: x.id,
                        title: x.title,
                        children: x.children,
                        expanded: true,
                        isSelected: true
                    }
                    return ret
                } else {
                    return {...x}
                }
            }
        )
        setState({...state, docs: ret, docs_id: row.id})
    }


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
                    refreshBoolean={false}
                    reFocus={refreshWidthFocus}
                    onClose={() => modal.hide("add")}
                />
            </Popup>

            {/*** Header ***/}
            <Header>
                <HEADER
                    state={state}
                    setState={setState}
                    refresh={refresh}
                    refreshInfo={refreshInfo}
                />
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

                        {/*<TestStripe*/}
                        {/*    state={state}*/}
                        {/*    setState={setState}*/}
                        {/*/>*/}
                        <DocsStripe state={state}
                                    setState={setState}
                                    onDragEnd={onDragEnd}
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
                                    status={status}
                                    params={params}
                                    setParams={setParams}
                                    setStatus={setStatus}
                                    setState={setState}
                                    refreshInfo={() => refreshInfo()}
                                    refresh={() => refresh()}
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