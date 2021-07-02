import React from 'react';
import {ErrorBoundary} from "@components";
import {Lang} from "@plugins";

export const JsonModal = ({state}) => {

    const [input, setInput] = React.useState({})

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


    return (
        <ErrorBoundary>
            <div>
                    <textarea
                        placeholder={Lang.get("Request Parameters")}
                        defaultValue={prepareText(state.data.parameters)}
                        onChange={(e)=> setInput(e.target.value)}
                        className='form-control custom-input'
                        style={{ backgroundColor: '#fff', minHeight: 400 }}
                    />
            </div>
        </ErrorBoundary>
    )
}