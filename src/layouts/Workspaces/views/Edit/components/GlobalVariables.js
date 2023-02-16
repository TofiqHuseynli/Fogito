import React from 'react';
import {ErrorBoundary, Lang} from "fogito-core-ui";

export const GlobalVariables = ({variables, setVars}) => {

    function addItem(index = 0) {
        let newItem = {key: "", value: ""};
        variables.splice(index + 1, 0,newItem)
        setVars(variables);
    }

    function removeItem(index) {
        variables.splice(index, 1)
        setVars(variables);
    }

    function setKey(index, key) {
        variables[index]['key'] = key;
        setVars(variables);
    }

    function setValue(index, key) {
        variables[index]['value'] = key;
        setVars(variables);
    }

    return (
        <ErrorBoundary>
            <div className="">
                {variables?.map((variable, index) => (
                    <div key={index} className="mb-3 d-flex">
                        <input
                            style={{width:'40%'}}
                            className="form-control"
                            placeholder={Lang.get("Key")}
                            value={variable.key}
                            onChange={(e) => setKey(index, e.target.value)}
                        />

                        <input
                            className="form-control mx-2"
                            placeholder={Lang.get("Value")}
                            value={variable.value}
                            onChange={(e) => setValue(index, e.target.value)}
                        />

                        <button className="btn btn-primary" onClick={() => addItem(index)}>
                            <i className="feather feather-plus fs-16"/>
                        </button>

                        <button className="btn btn-danger" onClick={() => removeItem(index)}>
                            <i className="feather feather-trash fs-16"/>
                        </button>
                    </div>
                ))}

                {variables?.length === 0 && (
                    <button
                        type='button'
                        className="btn btn-primary px-5"
                        onClick={addItem}
                    >
                        <i className="feather feather-plus fs-16"/>
                    </button>
                )}
            </div>
        </ErrorBoundary>
    )
}
