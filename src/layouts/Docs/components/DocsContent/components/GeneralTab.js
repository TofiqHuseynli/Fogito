import React from 'react';
import {ErrorBoundary, Lang,} from "fogito-core-ui";
import {JsonEditorNew} from "@components";
import Select from "react-select";
import {Parameters} from "@plugins";
import AsyncSelect from "react-select/async";

export function GeneralTab({state, setState}) {

    return (
        <ErrorBoundary>
            <div className='row'>
                <div className='col'>
                    <div className='row px-2 mt-3'>
                        <label className='required'>{Lang.get("ApiUrl")} </label>
                        <input
                            className='form-control'
                            placeholder={Lang.get('ApiUrl')}
                            value={state.data?.url}
                            onChange={(e) => setState({data: {...state.data, url: e.target.value}})}
                        />
                    </div>
                </div>
            </div>

            <label className='parent__label mt-2'>{Lang.get("Parameters")}</label>

            <JsonEditorNew
                formParams={state.data.parameters}
            />


            <div className='row'>
                <div className='col'>
                    <div className='row px-2 mt-3'>
                        <label className='required'>{Lang.get("Title")} </label>
                        <input
                            className='form-control'
                            placeholder={Lang.get('Title')}
                            value={state.data?.title}
                            onChange={e => setState({data: {...state.data, title: e.target.value}})}
                        />
                    </div>

                    <div className='row mt-3' style={{margin: '0'}}>
                        <label className='required'>{Lang.get("Methods")} </label>
                        <Select
                            isMulti={true}
                            className='form-control'
                            mode="tags"
                            allowClear
                            placeholder=""
                            value={state.data?.methods?.length ? state.data.methods : []}
                            options={Parameters.getRequestMethods()}
                            onChange={e => setState({data: {...state.data, methods: e}})}
                        />
                    </div>

                    <div className='row px-2 mt-3'>
                        <label>{Lang.get("Slug")}</label>
                        <input
                            className='form-control'
                            placeholder={Lang.get('Slug')}
                            value={state.data?.slug}
                            onChange={(e) => setState({data: {...state.data, slug: e.target.value}})}
                        />
                    </div>

                    <div className='row px-2 mt-3'>
                        <label>{Lang.get("Status")}</label>
                        <AsyncSelect
                            defaultOptions={Parameters.getStatusList()}
                            value={state.data?.status}
                            onChange={(status) => setState({data: {...state.data, status: status}})}
                            className="form-control"
                        />
                    </div>

                </div>
            </div>
        </ErrorBoundary>
    )
}
