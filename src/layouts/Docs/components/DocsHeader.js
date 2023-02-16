import React from "react";
import {Lang, ErrorBoundary, Api, useToast, Header} from "fogito-core-ui";
import {App} from "@plugins";
import {docsDelete, docsDuplicate, docsUpdate} from "@actions";
import {API_ROUTES} from "@config";
import {useHistory} from "react-router-dom";


export const DocsHeader = ({state, setState, refresh}) => {
    const toast = useToast()

    let xhr = [];
    const history = useHistory()

    const onSubmit = async () => {
        setState({loading: true});
        let response = await docsUpdate({
            id: state.docs_id,
            ...state.data,
        })

        console.log(state.data)
        toast.fire({
            title: response.description,
            icon: response.status,
        });

        if (response.status === 'success') {
            refresh()
        }
        setState({loading: false});
    }

    async function onDelete() {
        let response = await docsDelete({id: state.docs_id})

        toast.fire({
            title: response.description,
            icon: response.status,
        });
        if (response.status === 'success') {
            setState({loading: false, docs_id: ''})

            history.push(`/docs/${state.workspace_id}`)
            refresh()
        }
    }

    async function onDuplicate() {
        let response = await docsDuplicate({
            id: state.data?.id,
            workspace_id: state.data?.workspace_id,
            parent_id: state.data?.parent_id,
            position: "0"
        })
        toast.fire({
            title: response.description,
            icon: response.status,
        });
        if (response.status === 'success') {
            refresh()
        }
    }

    const sendFormData = (data) => {
        let key = 'import';

        xhr[key] = new XMLHttpRequest();

        xhr[key].addEventListener("load", function (e) {
            let response = JSON.parse(e.target.responseText);
            toast.fire({
                title: response.description,
                icon: response.status,
            });

            if (response.status === 'success') {
                refresh()
            }
        });

        xhr[key].open("POST", Api.convert(API_ROUTES["docsImport"], true));
        xhr[key].withCredentials = true;
        xhr[key].send(data);
    };

    const onFileSelect = (e, target) => {
        let {workspace_id} = state;
        for (let file of e.target.files) {
            file.loading = true;

            let formData = new FormData();
            formData.append("workspace_id", workspace_id);
            formData.append("file", file);
            sendFormData(formData);
        }
    };


    return (
        <ErrorBoundary>
            <Header>
                <div className="row m-0 justify-content-between">
                    <button
                        className="btn btn-primary"
                        onClick={() => history.push('/workspaces')}
                    >
                        <i className="feather feather-chevron-left"/>
                    </button>

                    <h3 className='text-primary mx-auto'>
                        {!!state.docs_id && Lang.get(state.data.title)}
                    </h3>

                    <div className='d-flex'>
                        <div className="dropdown">
                            <button
                                aria-expanded='false'
                                data-toggle="dropdown"
                                className="btn btn-primary d-flex align-items-center"
                                id="actions"
                            >
                                {Lang.get("Actions")}
                            </button>
                            <div className="dropdown-menu header_dropdown" aria-labelledby="actions">
                                <a className="dropdown-item">
                                    <div className="file-input">
                                        <input
                                            id="file"
                                            type="file"
                                            className="file"
                                            accept=".doc,.docx,.txt,.fog"
                                            onChange={(e) => onFileSelect(e, "file")}
                                        />
                                        <label htmlFor="file">{Lang.get("Import")}</label>
                                    </div>

                                </a>
                                {state.docs?.length > 0 && (
                                    <>
                                        <a className="dropdown-item"
                                           href={Api.convert(API_ROUTES.docsExport, true) + `?data[workspace_id]=${state.workspace_id}`}
                                           target="_blank"
                                           download
                                        >
                                            {Lang.get("Export")}
                                        </a>
                                        <a className="dropdown-item"
                                           href={Api.convert(API_ROUTES.docsPrintable, true) + `?data[workspace_id]=${state.workspace_id}`}
                                           target="_blank"
                                            //download
                                        >
                                            {Lang.get("Printable")}
                                        </a>
                                    </>
                                )}
                                {!!state.docs_id && (
                                    <>
                                        <a className="dropdown-item delete_action"
                                           onClick={() => App.deleteModal(() => onDelete())}
                                        >
                                            {Lang.get("Delete")}
                                        </a>
                                        <a className="dropdown-item"
                                           onClick={() => App.duplicateModal(() => onDuplicate())}
                                        >
                                            {Lang.get("Duplicate")}
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>

                        {state.docs_id && (
                            <button
                                className="btn btn-success"
                                onClick={() => onSubmit()}
                            >
                                {Lang.get("Save")}
                            </button>
                        )}

                    </div>
                </div>
            </Header>
        </ErrorBoundary>
    )
}
