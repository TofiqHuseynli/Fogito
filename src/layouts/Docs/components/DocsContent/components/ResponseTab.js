import React from 'react';
import {Lang, ErrorBoundary, Loading} from "fogito-core-ui";
import {useEffect} from "react";
import {requestsDelete, requestsEdit, requestsList} from "@actions";
import {DateLib} from "@plugins/DateLib";
import {Checkbox, Empty} from "antd";
import {AlertLib, createMarkup, jsonDesign} from "@plugins";

export function ResponseTab({id, workspace_id,tab})
{
    const initialState = {
        id: id,
        workspace_id: workspace_id,
        loading: true,
        list: [],
        renderIndex: 0
    }
    const [state, setState] = React.useReducer((prevState, newState) => {
        return {...prevState, ...newState};
    }, initialState);

    useEffect(() => {
        if (tab === 'responses' && id)
            loadResponses(id);
    }, [tab,id]);

    async function loadResponses(apiId){
        setState({loading:true})
        let response = await requestsList({doc_id: apiId});
        if(response.status === 'success') {
            setState({
                list: response.data,
                loading: false
            })
        }else{
            alert(response.description)
        }
    }

    async function setVisibleOnDocs(row, value){
        row.visible_on_docs = !!value ? 1: 0;
        let response = await requestsEdit({
            id: row.id,
            field: "visible_on_docs",
            value: row.visible_on_docs,
        })

        if(response.status === "error")
            alert(response.description)

        setState({renderIndex: state.renderIndex+1});
    }


    async function onDeleteRequest(rowId){
        let confirmed = await AlertLib.deleteCondition()
        if (!confirmed) return;

        let response = await requestsDelete({id:rowId})

        if(response.status === "error")
            alert(response.description)

        await loadResponses(id)
    }

    return(
        <ErrorBoundary>
            {/* Json Response */}
            {state.loading && <Loading/>}

            <div className='row' >
                <div className='col' >
                    {
                        state.list.length
                            ?
                            <div className='response-card overflow-visible' >
                                {
                                    !!state.list && state.list.map((row,i) =>
                                        <div key={i} className="response-item">

                                            <div className="delete-btn">
                                                <i className='feather feather-x text-danger fs-18' onClick={() => onDeleteRequest(row.id)}/>
                                            </div>

                                            <div className='row mb-2' >
                                                <div className='col' >
                                                    <span className="response-label">{Lang.get("Url")}:</span> {row.request?.url}
                                                </div>
                                            </div>
                                            <div className='row mb-2' >
                                                <div className='col' >
                                                    <span className="response-label">{Lang.get("Method")}:</span> {row.request?.method?.toUpperCase()}
                                                </div>
                                            </div>
                                            <div className='row mb-2' >
                                                <div className='col' >
                                                   <span className="response-label">{Lang.get("RequestParameters")}:</span>
                                                </div>
                                            </div>
                                            <div className='response-code mb-2'>
                                                <code>
                                                <pre className='fs-14'>
                                                    {
                                                        !!row.request?.parameters ?
                                                        <div style={{lineHeight: 1.3}} dangerouslySetInnerHTML={createMarkup(jsonDesign(row.request?.parameters))}/>
                                                            :
                                                            '{}'
                                                    }
                                                </pre>
                                                </code>
                                            </div>
                                            <div className='row mb-2' >
                                                <div className='col'>
                                                    <span className="response-label">{Lang.get("Response")}:</span>
                                                </div>
                                            </div>
                                            <div className='response-code  mb-2'>
                                                <code>
                                                    <pre className='fs-14'>
                                                        {row?.response?.response && row.response?.response.substr(0, 1) === "{" ? JSON.stringify(JSON.parse(row.response?.response), null, 2): row.response?.response}
                                                    </pre>
                                                </code>
                                            </div>

                                            <div className='row' >
                                                <div className='col'>
                                                    <span className="response-label" style={{paddingRight: 20}}>{DateLib.date("Y-m-d H:i:s", row.created_at)}</span>

                                                    <Checkbox checked={row.visible_on_docs === 1 && true} onChange={(e)=> setVisibleOnDocs(row, e.target.checked)} >
                                                        {Lang.get("VisibleOnDocs")}
                                                    </Checkbox>

                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                            :
                            <Empty className='text-muted mt-6' description={Lang.get("NoData")}/>

                    }
                </div>
            </div>
        </ErrorBoundary>
    )
}
