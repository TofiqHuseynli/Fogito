import {workspacesInfo, requestsProxy, requestsCreate} from "@actions";
import {Api, Lang} from "fogito-core-ui";
import {AlertLib, isJsonString} from "@plugins";
import Swal from "sweetalert2";

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
        case 'int':
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
    setState({loadingResponse: true,response:''})
    let response = await requestsProxy({
        doc_id: state.id,
        method: state.method.value,
        url: state.url,
        params: JSON.parse(state.raw),
        headers: state.headers,
        cookies: state.cookies,
    })
    if (response.status === 'success') {
        setState({
            response: JSON.stringify(JSON.parse(response.data.response),null,2),
            request: response.data.request,
            loadingResponse: false
        })
    } else {
        AlertLib.errorAlert(response.description);
        setState({loading: false, loadingResponse: false})
    }
}


export async function saveRequest(state, setState)
{
    if (!isJsonString(state.raw) || !isJsonString(state.response)){
        Swal.fire({
            icon: 'warning',
            title: 'Oops..',
            text: Lang.get('WrongJsonFormat'),
        })
        return;
    }

    setState({loading: true})
    let response = await requestsCreate({
        doc_id: state.id,
        request: {
            method: state.method.value,
            url: state.url,
            parameters: JSON.parse(state.raw),
            headers: state.headers,
            cookies: state.cookies,
        },
        response: {
            request:state.request,
            response:state.response,
        }
    })

    if (response.status === 'success') {
        setState({loading: false})
    } else {
        AlertLib.errorAlert(response.description);
        setState({loading: false})
    }
}


export async function loadData(state, setState)
{
    setState({loading: true})
    let response = await workspacesInfo({id: state.workspace_id})
    if(response.status === 'success') {
        setState({loading: false })
    }
}


export function getDefaultMethod(methods)
{
    let res = {
        value: 'get',
        label: Lang.get('get')
    };

    if (methods && methods.length>0){
        res = methods[0];
    }

    return res
}
