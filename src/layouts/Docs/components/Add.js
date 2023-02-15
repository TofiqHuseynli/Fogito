import React from 'react';
import {ErrorBoundary, useToast, Lang,} from "fogito-core-ui";
import {docsCreate} from "@actions";


export const Add = ({workspace_id, onClose, refresh, parent_id = '', doc_type = 'folder'}) => {
    const toast = useToast()

    const [params, setParams] = React.useReducer((prevState, newState) =>
        ({...prevState, ...newState}), {
        title: '',
        type: doc_type, //folder / document
        parent_id: parent_id,
        workspace_id: workspace_id,
    });

    const onSubmit = async () => {
        let response = await docsCreate(params)

        toast.fire({
            title: response.description,
            icon: response.status,
        });
        if (response.status === 'success') {
            refresh()
            onClose()
        }
    }


    return (
        <ErrorBoundary>
            <div className="form-group">
                <label className='form-control-label'>{Lang.get("Title")}</label>
                <input
                    className='form-control'
                    placeholder={Lang.get('Title')}
                    autoFocus={true}
                    onChange={(e) => setParams({title: e.target.value})}
                />
            </div>
            <div className="d-flex">
                <button
                    onClick={onSubmit}
                    type='button'
                    className="btn btn-primary w-50 mr-2"
                >
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
        </ErrorBoundary>
    )
}
