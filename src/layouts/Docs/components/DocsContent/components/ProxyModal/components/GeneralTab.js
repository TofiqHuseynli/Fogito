import React from 'react';
import {ErrorBoundary, Lang, Textarea,} from "fogito-core-ui";
import {prepareText, saveRequest} from "@layouts/Docs/components/DocsContent/components/ProxyModal/actions";
import {AlertLib, copyToClipBoard, isJsonString} from "@plugins";
import Swal from "sweetalert2";

export function GeneralTab({state, setState}) {

    return (
        <ErrorBoundary>
            <div className='row mt-3' >
                <div className='col' >

                    <div
                        style={{right:10,top:10}}
                        className='position-absolute'
                    >
                        <a
                            href="#"
                            onClick={()=> saveRequest(state, setState)}
                            title={Lang.get("Save")}
                            style={{padding:'5px',marginRight:5}}
                        >
                            <i style={{fontSize: 16}} className="feather feather-save text-primary"/>
                        </a>
                        <a
                            href="#"
                            onClick={()=> {
                                if (isJsonString(state.raw)){
                                    setState({raw: JSON.stringify(JSON.parse(state.raw),null,2)})
                                }else{
                                    Swal.fire({
                                        icon: 'warning',
                                        title: 'Oops..',
                                        text: Lang.get('WrongJsonFormat'),
                                    })
                                }
                            }}
                            title={Lang.get("Prettify")}
                            style={{padding:'5px',marginRight:5}}
                        >
                            <i style={{fontSize: 16}} className="feather feather-code text-primary"/>
                        </a>
                    </div>

                    <Textarea
                        placeholder={Lang.get("RequestParameters")}
                        rows="10"
                        maxLength="1500"
                        className='form-control'
                        value={state.raw}
                        onChange={(e)=> setState({raw: e.target.value})}
                    />
                </div>
            </div>

            {state.request.url && (
                <div className='my-2'>
                    <label className="m-0">{Lang.get('RequestUrl')}</label>
                    <p
                        className='fs-15 font-weight-400 m-0 text-primary cursor-pointer'
                        style={{wordBreak:'break-all'}}
                        onClick={() => copyToClipBoard(state.request.url)}
                    >
                        {state.request.url}
                    </p>
                </div>
            )}

            <div className='response mt-1' >
                {state.loadingResponse && <h4 className='p-3' >{Lang.get("LoadingPleaseWait")}</h4> }

                {state.response && (
                    <div className='position-relative'>
                        <div
                            style={{right:10,top:10}}
                            className='position-absolute'
                        >
                            <a
                                href="#"
                                onClick={()=> {
                                    if (isJsonString(state.response)){
                                        setState({response: JSON.stringify(JSON.parse(state.response),null,2)})
                                    }else{
                                        Swal.fire({
                                            icon: 'warning',
                                            title: 'Oops..',
                                            text: Lang.get('WrongJsonFormat'),
                                        })
                                    }
                                }}
                                title={Lang.get("Prettify")}
                                style={{padding:'5px',marginRight:5}}
                            >
                                <i style={{fontSize: 16}} className="feather feather-code text-primary"/>
                            </a>
                        </div>
                        <Textarea
                            rows="10"
                            maxLength="1500"
                            className='form-control'
                            value={state.response}
                            onChange={(e)=> setState({response: e.target.value})}
                        />
                    </div>
                )}

            </div>

        </ErrorBoundary>
    )
}
