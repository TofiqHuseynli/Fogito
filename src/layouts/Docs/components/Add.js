import React from 'react';
import {App} from "@plugins";
import {ErrorBoundary, useToast} from "fogito-core-ui";
import {Lang} from "@plugins";
import {apisCreate, apisCreateSub} from "@actions";


export const Add = ({_id, refresh, type, docType, onClose, reFocus, refreshBoolean}) => {
    const toast = useToast()
    const [params, setParams] = React.useState({
        title: '',
        type: docType,
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
        } else {

        }

        if(response.status === 'success') {
            toast.fire({
                title: response.data,
                icon: "success",
            });
            reFocus()
            refreshBoolean && refresh()
            onClose()
        } else {
            toast.fire({
                title: response.data,
                icon: "error",
            });
        }
    }


    return (
        <ErrorBoundary>
            <form onSubmit={onSubmit} >
                <div className="form-group">
                    <label className='form-control-label' >{Lang.get("Title")}</label>
                    <input className='form-control'
                           placeholder={Lang.get('Title')}
                           autoFocus={true}
                           onChange={(e) => setParams({...params, title: e.target.value})}
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
