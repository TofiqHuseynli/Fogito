import React from "react";
import {ErrorBoundary, Loading, Textarea, App} from "fogito-core-ui";
import {Lang} from "@plugins";
import {prepareText, sendRequest, loadData, saveRequest} from "@layouts/Docs/TestApi/actions";

export const TestApi = ({id, project_id, url, parameters, methods}) => {
    const initialState = {
        id: id,
        project_id: project_id,
        url: url,
        projectUrl: url,
        method: methods && methods.length>0 ? methods[0]: "get",
        loading: false,
        loadingResponse: false,
        response: "",
        raw: "",
    }
    const [state, setState] = React.useReducer((prevState, newState) => {
        return {...prevState, ...newState};
    }, initialState);

    React.useEffect(()=> {
        setState({raw: prepareText(parameters)});
        loadData(state, setState);
    },[])

    return(
        <ErrorBoundary>
            {state.loading && <Loading />}
            <div className='api-test' >
                <div className='row' >
                    <div className='col' >
                        <label>{Lang.get("Url")}</label>
                        <div className="input-group">
                            <input
                                className="form-control"
                                placeholder={Lang.get("Url")}
                                value={state.url}
                                onChange={(e) => setState({url: e.target.value})}
                            />
                            <div className="input-group-append">
                                <i className='feather feather-play btn btn-success' onClick={()=> sendRequest(state, setState)} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className='row mt-3' >
                    <div className='col' >
                        <div style={{flexDirection: 'row', display: 'flex'}}>
                            <div style={{flex: 1}}>
                                <label>{Lang.get("RequestParameters")}</label>
                            </div>
                            <a
                                onClick={()=> saveRequest(state, setState)}
                                href="#"
                                title={Lang.get("Save")}
                                style={{flex: 1, maxWidth: 50, height: 30, background: '#f0f2f5', borderTopLeftRadius: 7, borderTopRightRadius: 7, marginRight: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
                                <i style={{fontSize: 16}} className="feather feather-save text-primary"/>
                            </a>
                        </div>
                        <Textarea
                            placeholder={Lang.get("RequestParameters")}
                            rows="10"
                            maxLength="1500"
                            className='form-control'
                            defaultValue={state.raw}
                            onChange={(e)=> setState({raw: e.target.value})}
                        />
                    </div>
                </div>

                <div className='response mt-4' >
                    {
                        state.loadingResponse ?
                            <h4 className='p-3' >{Lang.get("Loading... Please, wait!")}</h4>
                            :
                            <pre className='p-3' >
                                <div style={{ fontSize: 14 }} dangerouslySetInnerHTML={App.getData().createMarkup(App.getData().jsonDesign(state.response))}/>
                            </pre>
                    }
                </div>
            </div>
        </ErrorBoundary>
    )
}