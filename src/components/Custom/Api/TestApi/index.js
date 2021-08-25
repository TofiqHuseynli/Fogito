import React from "react";
import {ErrorBoundary, Loading, Textarea, App} from "fogito-core-ui";
import {Lang} from "@plugins";
import {projectsInfo, proxyList, proxyRequest} from "@actions";


export const TestApi = ({state}) => {

    const [loading, setLoading] = React.useState(false)
    const [loadingRes, setLoadingRes] = React.useState(false)
    const [input, setInput] = React.useState({})
    const [url, setUrl] = React.useState()
    const [res, setRes] = React.useState("")

    React.useEffect(()=> {
        let newJSON = {};
        for (let par of state.data.parameters) {
            newJSON[par.key] = jsonType(par);
        }
        setInput(JSON.stringify(newJSON))
    },[])

    // Recursive json
    function prepareText (params) {
        let newJSON = {};
        for (let par of params) {
            newJSON[par.key] = jsonType(par);
        }
        return JSON.stringify(newJSON, undefined, 2)
    }

    function jsonType (par) {
        switch (par.type) {
            case 'string':
                return par.value
            case 'integer':
                return par.value
            case 'boolean':
                return par.value
            case 'float':
                return par.value
            case 'object':
                let childJSON = {};
                for (let val of par.value) {
                    childJSON[val.key] = jsonType(val);
                }
                return childJSON
            case 'array':
                let childArrayJSON = [];
                for (let val of par.value) {
                    childArrayJSON.push(jsonType(val));
                }
                return childArrayJSON
        }
    }
    // *** //

    const loadData = async () => {
        setLoading(true)
        let id = state.id
        let response = await projectsInfo({id})
        if(response.status === 'success') {
            setLoading(false)
            setUrl(response.data.api_url + state.data.url)
        }
    }

    const onProxy = async () => {
        setLoadingRes(true)
        let response = await proxyRequest({
            data: {
                api_id: state.data.id,
                url: url,
                params: JSON.parse(input),
                method: state.data.methods[0],
                response: res
            }
        })
        if (response.status === 'success') {
            setLoadingRes(false)
            if(response.data.charAt(0) === '{') {
                setRes(JSON.parse(response.data))
                // setSaveBtn(true)
            } else {
                setRes(response.data)
            }
        } else {
            setLoading(false)
            setRes(response.description)

        }
    }

    React.useEffect(()=> {
        loadData()
    },[])


    return(
        <ErrorBoundary>
            {loading && <Loading />}
            <div className='api-test' >
                <div className='row' >
                    <div className='col' >
                        <label>{Lang.get("Url")}</label>
                        <div className="input-group">
                            <input
                                className="form-control"
                                placeholder={Lang.get("Url")}
                                value={url}
                                onChange={(e)=> setUrl(e.target.value)}
                            />
                            <div className="input-group-append">
                                <i className='feather feather-play btn btn-success' onClick={()=> onProxy()} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className='row mt-3' >
                    <div className='col' >
                        <label>{Lang.get("Params")}</label>
                        <Textarea
                            placeholder={Lang.get("Request Parameters")}
                            rows="10"
                            maxLength="1500"
                            className='form-control'
                            defaultValue={prepareText(state.data.parameters)}
                            onChange={(e)=> setInput(e.target.value)}
                        />
                    </div>
                </div>

                <div className='response mt-4' >
                    {
                        loadingRes ?
                            <h4 className='p-3' >
                                {Lang.get("Loading... Please, wait!")}
                            </h4>
                            :
                            <pre className='p-3' >
                                    <div style={{ fontSize: 14 }}
                                         dangerouslySetInnerHTML={App.getData().createMarkup(App.getData().jsonDesign(res))}
                                    />
                                </pre>
                    }
                </div>
            </div>
        </ErrorBoundary>
    )
}