import React, {useEffect} from 'react';
import {Lang} from "@plugins";

export default function GlobalVariablesBox({ variables, setVars })
{
    function addVar(index){
        variables.splice(index+1, 0, {key: "", value: ""})
        setVars(variables);
    }

    function removeVar(index){
        variables.splice(index, 1)
        setVars(variables);
    }

    function setKey(index, key)
    {
        variables[index]['key'] = key;
        setVars(variables);
    }

    function setValue(index, key)
    {
        variables[index]['value'] = key;
        setVars(variables);
    }

    return (
        <>
            {
                variables?.map((variable, index) => (
                    <div key={index} className="gvar-row mb-3">
                        <input
                            style={{flex: 1}}
                            className="form-control"
                            placeholder={Lang.get("Key")}
                            value={variable.key}
                            onChange={(e) => setKey(index, e.target.value)}
                        />

                        <input
                            style={{flex: 2, marginLeft: '1rem'}}
                            className="form-control"
                            placeholder={Lang.get("Value")}
                            value={variable.value}
                            onChange={(e) => setValue(index, e.target.value)}
                        />

                        <button className="btn btn-primary lh-24 px-3" onClick={() => addVar(index)}>
                            <i className="feather feather-plus fs-16"/>
                        </button>

                        <button className="btn btn-danger lh-24 px-3" onClick={() => removeVar(index)}>
                            <i className="feather feather-trash fs-16"/>
                        </button>
                    </div>
                ))
            }

            {
                variables?.length === 0 &&
                <div className="gvar-row">
                    <button className="btn btn-primary lh-24 px-3" onClick={() => addVar(0)}>
                        <i className="feather feather-plus fs-16"/>
                    </button>
                </div>
            }
        </>
    )
}
