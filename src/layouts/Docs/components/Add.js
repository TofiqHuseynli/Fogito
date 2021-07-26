import React from 'react';
import {ErrorBoundary, Inputs} from "@components";
import {App, Lang} from "@plugins";
import {apisCreate, apisCreateSub} from "@actions";


export const Add = ({_id, refresh, type, onClose, reFocus, refreshBoolean}) => {
    const [params, setParams] = React.useState({
        title: '',
        slug: 'test'
    })

    // cookie.set('_stripe_child_id')
    const onSubmit = async (e) => {
        e.preventDefault()
        let response = null
        if(type === 'add_docs') {
            response = await apisCreate({data: params, project_id: _id})
        } else if (type === 'add_sub') {
            response = await apisCreateSub({data: params, id: _id})
        } else {}

        if(response.status === 'success') {
            reFocus()
            refreshBoolean && refresh()
            onClose()
        } else {
            App.errorModal(response.description)
        }
    }


    return (
        <ErrorBoundary>
            <form onSubmit={onSubmit} >
                <div className="form-group">
                    <label className="form-control-label">{Lang.get("Title")}</label>
                    <Inputs type='input'
                            onChange={(e) => setParams({...params, title: e.target.value})}
                            placeholder={Lang.get("Title")}
                            autoFocus={true}
                    />
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