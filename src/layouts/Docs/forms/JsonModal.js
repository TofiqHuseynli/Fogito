import React from 'react';
import {ErrorBoundary, Textarea,Lang,} from "fogito-core-ui";


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
                <Textarea
                    placeholder={Lang.get("Request Parameters")}
                    rows="10"
                    maxLength="1500"
                    className='form-control'
                    defaultValue={prepareText(state.data.parameters)}
                    onChange={(e)=> setInput(e.target.value)}
                />
            </div>
        </ErrorBoundary>
    )
}
