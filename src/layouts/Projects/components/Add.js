import React from 'react';
import {App, Lang} from "@plugins";
import {ErrorBoundary, useToast} from 'fogito-core-ui'
import {projectsCreate} from "@actions";


export const Add = ({ refresh, onClose }) => {

    const toast = useToast();
    const [title, setTitle] = React.useState('')

    const onSubmit = async (e) => {
        e.preventDefault()
        let response = await projectsCreate({data: { title: title }})
        if(response.status === 'success') {
            toast.fire({
                title: response.description,
                icon: "success" ,
            });
            refresh()
            onClose()
        } else {
            toast.fire({
                title: response.description,
                icon: "error",
            });
        }
    }

    return (
        <ErrorBoundary>
            <form onSubmit={onSubmit} >
                <div className="form-group">
                    <div className="form-group">
                        <label className='form-control-label' >{Lang.get("Title")}</label>
                        <input className='form-control'
                               placeholder={Lang.get('Title')}
                               value={title}
                               autoFocus={true}
                               onChange={(e) => setTitle(e.target.value)}
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