import React from 'react';
import {ErrorBoundary} from "fogito-core-ui";
import {Lang} from "@plugins";
import {JsonEditor} from "@components";
import {Checkbox, Select} from "antd";

export function Request({ state, setState, status, setStatus, params, setParams })
{
    const onStatus = (e) => {
        switch (e.target.checked) {
            case false:
                setStatus({...status, label: 'Closed', value: 3})
                setState({...state, data: {...state.data, status: 3}})
                break;
            case true:
                setStatus({...status, label: 'Active', value: 1})
                setState({...state, data: {...state.data, status: 1}})
                break;
        }
    }

    return (
        <ErrorBoundary>
            <div className='row' >
                <div className='col' >
                    <div className='row px-2 mt-3' >
                        <label>{Lang.get("ApiUrl")}<span className='text-danger fs-18 ml-1' >*</span></label>
                        <input className='form-control'
                               placeholder={Lang.get('ApiUrl')}
                               value={state.data.url}
                               onChange={(e) => setState({...state, data: {...state.data, url: e.target.value}})}
                        />
                    </div>
                </div>
            </div>

            <label className='parent__label mt-2' >{Lang.get("Parameters")}</label>
            <div className='row' >
                {/*<MyComp*/}
                {/*    param={params.parameters}*/}
                {/*    setParam={setParams}*/}
                {/*/>*/}

                <JsonEditor
                    state={state}
                    setState={setState}
                />
            </div>

            <div className='row' >
                <div className='col' >
                    <div className='row px-2 mt-3' >
                        <label>{Lang.get("Title")}<span className='text-danger fs-18 ml-1' >*</span></label>
                        <input className='form-control'
                               placeholder={Lang.get('Title')}
                               value={state.data.title}
                               onChange={(e) => setState({...state, data: {...state.data, title: e.target.value}})}
                        />
                    </div>


                    <div className='row mt-3' style={{ margin:'0' }} >
                        <label>{Lang.get("Methods")}<span className='text-danger fs-18 ml-1' >*</span></label>
                        <Select mode="tags"
                                allowClear
                                style={{ width: '100%' }}
                                placeholder=""
                                value={state.data.methods?.length ? state.data.methods : []}
                                options={state.options}
                                onChange={(e) => {
                                    setState({...state, data: {...state.data, methods: e}})
                                }}
                        />
                    </div>

                    <div className='row px-2 mt-3' >
                        <label>{Lang.get("Slug")}</label>
                        <input className='form-control'
                               placeholder={Lang.get('Slug')}
                               value={state.data.slug}
                               onChange={(e) => setState({...state, data: {...state.data, slug: e.target.value}})}
                        />
                    </div>

                    <div className='mb-2 mt-3 d-flex flex-column w-25' >
                        <label className='label mb-1' >{Lang.get("Status")}</label>
                        <Checkbox checked={status.value === 1 && true} onChange={(e)=> onStatus(e)} >
                            {status.value === 1 ? 'Active' : null}
                        </Checkbox>
                    </div>

                </div>
            </div>
        </ErrorBoundary>
    )
}
