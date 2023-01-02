import React from 'react';
import {Api, App, ErrorBoundary} from "fogito-core-ui";
import {Lang} from "@plugins";
import {useEffect} from "react";
import {proxyList} from "@actions";
import {DateLib} from "@plugins/DateLib";
import {Checkbox} from "antd";

export function Responses({id, project_id})
{
    const initialState = {
        id: id,
        project_id: project_id,
        loading: false,
        list: [],
        renderIndex: 0
    }
    const [state, setState] = React.useReducer((prevState, newState) => {
        return {...prevState, ...newState};
    }, initialState);

    useEffect(() => {
        loadResponses(id);
    }, [id]);

    async function loadResponses(apiId){
        let response = await proxyList({data: {api_id: apiId}});
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
        let response = await Api.post("requestUpdateField", {data: {
            id: row.id,
            field: "visible_on_docs",
            value: row.visible_on_docs,
        }});
        if(response.status === "error")
            alert(response.description)

        setState({renderIndex: state.renderIndex+1});
    }
    return(
        <ErrorBoundary>
            {/* Json Response */}
            <div className='row' >
                <div className='col' >
                    {
                        state.list.length
                            ?
                            <div className='response-card' >
                                {
                                    !!state.list && state.list.map((row,i) =>
                                        <div key={i} className="response-item">
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
                                                        <div style={{lineHeight: 1.3}} dangerouslySetInnerHTML={App.getData().createMarkup(App.getData().jsonDesign(row.request?.parameters))}/>
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
                            <div className='d-flex justify-content-center align-items-center flex-column pt-5' >
                                <img src='/frame/docspanel/assets/icons/empty.svg' alt='' />
                                <p className='text-muted mt-3' >{Lang.get('NotYet')}</p>
                            </div>
                    }
                </div>
            </div>
        </ErrorBoundary>
    )
}
