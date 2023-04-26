import React from 'react';
import {docsInfo,docsStripe} from "@actions";
import {DocsContent, DocsSidebar, DocsHeader} from "./components";
import {Add} from "./components";
import {useHistory} from 'react-router-dom';
import {
    ErrorBoundary,
    useCookie,
    Lang,
    Popup,
    useModal,
} from "fogito-core-ui";
import {Empty} from "antd";

export const Docs = (props) => {

    const {match} = props;

    const modal = useModal()
    const history = useHistory()
    const cookie = useCookie()

    //  actions
    const [state, setState] = React.useReducer((prevState, newState) => {
        return {...prevState, ...newState};
    }, {
        id: match.params.id,
        workspace_id: match.params.id,
        docs_id: match.params.docs_id,
        doc_type: 'folder', //folder /document

        docs: [],
        file: {},
        data: {},
        activeTab: 'general',
        loading: false,
        loadingContent: false,
    });

    const refreshInfo = async () => {
        setState({loading: true})
        let response = await docsInfo({id : state.docs_id})
        if (response.status === 'success') {
            setState({ data: response.data })
        }
        setState({loading: false})
    }


    async function refreshWidthFocus() {
        setState({loadingContent: true})
        let response = await docsStripe({workspace_id: state.workspace_id})
        if (response.status === 'success') {
            setState({loadingContent: false})
            onFocus(response.data)
        }
    }


    async function refresh() {
        setState({loadingContent: true})
        let response = await docsStripe({workspace_id: state.workspace_id})
        if (response.status === 'success') {
            setState({
                docs: response.data,
                loadingContent: false
            })
        }
    }

    const onAddRequest = (type) =>{
        modal.show("add_request")
        setState({doc_type:type})
    }


    const onFocus = (data) => {
        let docsId = data.slice(-1)[0].id;

        cookie.remove('_stripe_id')
        history.push(`/docs/${state?.workspace_id}/${docsId}`)
        let selectedDoc = data.find(x => x.id === docsId)
        let docsData = data.map(item => item.id === selectedDoc.id ? {...item, expanded: true, isSelected: true} : item);

        setState({
            docs_id: selectedDoc.id,
            docs: docsData,
        })
    }



    React.useEffect(() => {
        // window.scrollTo(0, 0);
        state.docs_id && refreshInfo()
    }, [state.docs_id])


    React.useEffect(() => {
        refresh()
        state.docs_id && refreshInfo()
    }, [])


    return (
        <ErrorBoundary>

            <Popup
                show={modal.modals.includes("add_request")}
                title={Lang.get("AddDocs")}
                onClose={() => modal.hide("add_request")}
            >
                <Add
                    workspace_id={state.workspace_id}
                    parent_id={state.docs_id}
                    doc_type={state.doc_type}
                    refresh={refresh}
                    onClose={() => modal.hide("add_request")}
                />
            </Popup>

            <section className="container-fluid position-relative pb-1">
                <div className="d-flex p-3 row">

                    {/* Docs Sidebar */}
                    <div className='docs_sidebar card col-lg-3'>
                        <DocsSidebar
                            state={state}
                            setState={setState}
                            onAddRequest={onAddRequest}
                        />
                    </div>

                    {/* Docs Content */}
                    <div className='col-lg-9 pr-lg-0 docs_right'>
                        <DocsHeader
                            state={state}
                            setState={setState}
                            refresh={refresh}
                        />

                        <div className='card docs_content px-3 py-1'>
                            {state.docs_id && (
                                <DocsContent
                                    state={state}
                                    setState={setState}
                                />
                            )}

                            {!state.docs_id && (
                                <div className='d-flex flex-column h-100 justify-content-center align-items-center'>
                                    <Empty description=''/>
                                    <button
                                        className="btn btn-secondary text-primary w-25 lh-24 px-3 mt-3"
                                        onClick={() => onAddRequest('folder')}
                                    >
                                        {Lang.get("Add")}
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            </section>
        </ErrorBoundary>
    )
}
