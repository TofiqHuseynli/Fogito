import React from 'react';
import {ErrorBoundary} from "@components";


export const TestApi = () => {

    const [url, setUrl] = React.useState(apiUrl + item.url)
    const [method, setMethod] = React.useState('GET')
    const [input, setInput] = React.useState({})
    const [res, setRes] = React.useState("")

    // Methods from api
    const getMethod = () => {
        switch (item.methods[0]) {
            case 'put': setMethod('put'); break;
            case 'get': setMethod('get'); break;
            case 'post': setMethod('post'); break;
            case 'delete': setMethod('delete'); break;
        }
        return method
    }

    const onSubmit = async () => {
        setLoading(true)
        let response = await proxyDocs({
            data:{
                api_id: item.id,
                url: url,
                params: JSON.parse(input),
                method: method
            }
        })
        if (response) {
            setLoading(false)
            setRes(JSON.parse(response.data))
            setSaveBtn(true)
        } else {
            // setLoading(false)
            // App.errorModal(JSON.stringify(response.data))
            // setRes(JSON.stringify(response.data))
        }
    };


    return (
        <ErrorBoundary>
            test
        </ErrorBoundary>
    )
}