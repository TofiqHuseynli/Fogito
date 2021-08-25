import React from "react";
import {Auth, ErrorBoundary} from "fogito-core-ui";
import {App, Lang} from "@plugins";
import {apisCopy, apisDelete, apisUpdate} from "@actions";
import {API_ROUTES} from "@config";
import {useHistory} from "react-router-dom";


export const HEADER = ({state, setState, refresh, refreshInfo}) => {

    let xhr = [];
    const history = useHistory()

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
            refreshInfo()
        } else {
            setState({
                error: response.description,
                loading: false
            })
            App.errorModal(response.description);
        }
    }

    async function onDelete() {
        let id = state.docs_id;
        let response = await apisDelete({id})
        if(response.status === 'success') {
            setState({
                ...state,
                loading: false,
                docs_id: ''
            })
            history.push(`/docs/${state.id}`)
            refresh()
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
            refresh()
        } else {
            App.errorModal(response.description)
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
            file.loading = true;

            let formData = new FormData();
            formData.append("token", Auth.get("token"));
            formData.append("project_id", pro_id);
            formData.append("file", file);
            sendFormData({
                data: formData,
                target,
            });
        }
    };


    return(
        <ErrorBoundary>
            <div className="col d-flex justify-content-between align-items-center px-0">

                <div className='col-3 mx-3' />

                <div className="col-md-1 pl-0">
                    <button
                        className="btn btn-primary lh-24 px-3 text-center"
                        onClick={() => history.push('/projects')}
                    >
                        <i className="feather feather-chevron-left fs-22 align-middle" />
                    </button>
                </div>

                <h3 className='text-primary mx-auto' >
                    {!!state.docs_id && Lang.get(state.data.title)}
                </h3>

                <>
                    <div className="dropdown">
                        <button className="btn btn-primary d-flex align-items-center m-0"
                                id="actions"
                                data-toggle="dropdown"
                        >
                            {Lang.get("Actions")}
                            <i className='feather feather-chevron-down fs-18 ml-2'/>
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
                            {
                                state.docs?.length > 0 ?
                                    <a className="dropdown-item"
                                       href={`https://docs.fogito.com/apis/export?token=${Auth.get("token")}&lang=${Auth.get("lang")}&project_id=${state.pro_id}`}
                                       target="_blank"
                                       download
                                    >
                                        {Lang.get("Export")}
                                    </a> : null
                            }
                            {
                                !!state.docs_id &&
                                <>
                                    <a className="dropdown-item delete_action"
                                       onClick={() => App.deleteModal(() => onDelete())}
                                    >
                                        {Lang.get("Delete")}
                                    </a>
                                    <a className="dropdown-item"
                                       onClick={()=> App.duplicateModal(()=> onDuplicate())}
                                    >
                                        {Lang.get("Duplicate")}
                                    </a>
                                </>
                            }
                        </div>
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
        </ErrorBoundary>
    )
}