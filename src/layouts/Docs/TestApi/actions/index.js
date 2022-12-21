import {projectsInfo, proxyRequest} from "@actions";
import {Api} from "fogito-core-ui";

export function prepareText (params)
{
    if(!params)
        return '{}';
    let newJSON = {};
    for (let par of params)
        newJSON[par.key] = jsonType(par);
    return JSON.stringify(newJSON, undefined, 2)
}


export function jsonType (par)
{
    switch (par.type) {
        case 'string':
            return par.value
        case 'integer':
            return parseInt(par.value)
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
            for (let val of par.value)
                childArrayJSON.push(jsonType(val));
            return childArrayJSON
    }
}


export async function sendRequest(state, setState)
{
    setState({loadingResponse: true})
    let response = await proxyRequest({
        data: {
            api_id: state.id,
            method: state.method,
            url: state.url,
            params: JSON.parse(state.raw),
            //response: state.response
        }
    })
    if (response.status === 'success') {
        if(response.data.charAt(0) === '{') {
            setState({response: response.data, loadingResponse: false})
        } else {
            setState({response: response.data, loadingResponse: false})
        }
    } else {
        setState({loading: false, loadingResponse: false, response: response.description})
    }
}


export async function saveRequest(state, setState)
{
    setState({loading: true})
    let response = await Api.post("requestSave", {
        data: {
            api_id: state.id,
            request: {
                method: state.method,
                url: state.url,
                parameters: JSON.parse(state.raw)
            },
            response: state.response
        }
    })
    if (response.status === 'success') {
        setState({loading: false})
    } else {
        alert(response.description);
        setState({loading: false})
    }
}


export async function loadData(state, setState)
{
    setState({loading: true})
    let response = await projectsInfo({id: state.project_id})
    if(response.status === 'success') {
        setState({
            loading: false,
            url: response.data.api_url + state.projectUrl
        })
    }
}
