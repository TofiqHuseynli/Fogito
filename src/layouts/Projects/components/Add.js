import React from 'react';
import {ErrorBoundary, Inputs} from "@components";
import {App, Lang} from "@plugins";
import {projectsCreate} from "@actions";


export const Add = ({ refresh, onClose }) => {

    const [title, setTitle] = React.useState('')

    const onSubmit = async (e) => {
        e.preventDefault()
        let response = await projectsCreate({data: { title: title }})
        if(response.status === 'success') {
            refresh()
            onClose()
        } else {
            App.errorModal(response.description)
        }
    }

    return (
        <ErrorBoundary>
            <form onSubmit={onSubmit} >
                <div className="form-group">
                    <div className="form-group">
                        <label className="form-control-label">{Lang.get("Title")}</label>
                        <Inputs type='input'
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder={Lang.get("Title")}
                                autoFocus={true}
                                divClass=''
                        />
                    </div>
                </div>
                <div className="d-flex">
                    <button className="btn btn-primary w-50 mr-2">
                        {Lang.get("Submit")}
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary w-50 ml-2"
                        onClick={onClose}
                    >
                        {Lang.get("Close")}
                    </button>
                </div>
            </form>
        </ErrorBoundary>
    )
}