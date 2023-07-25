import React, {useEffect} from "react";
import { ErrorBoundary } from "fogito-core-ui";
import {useOutsideAlerter} from "@hooks";
import {Parameters} from "@plugins";
import {getValueByType} from "@components/Custom/JsonEditorNew/actions/actions";

export const NewLine = ({disableKey = false,onAdd,setShowNewLine}) => {

    const [newItem,setNewItem] = React.useReducer((prevState, newState) => {
        return {...prevState, ...newState};
    }, {
        key:'',
        type:'string',
        value:'',
    });

    const containerRef = React.useRef();
    const inputRef = React.useRef(null);

    useOutsideAlerter(containerRef, () => setShowNewLine(false));

    useEffect(()=>{
        !disableKey && inputRef.current.focus()
    },[])

    const types = Parameters.getVariableTypes()

    const handleKeyDown = async (event) => {
        if (event.key === 'Enter') {
            await addNewItem()
            setShowNewLine(true)
        }
    }

    const addNewItem = async () =>{
        let res = await onAdd(newItem)
        if (res === 'error')
            return;

        setNewItem({
            key:'',
            type:'string',
            value:'',
        })

        setShowNewLine(false)
    }

    const listType = ['array','object'].includes(newItem.type);

    return (
        <ErrorBoundary>
            <div
                onKeyDown={handleKeyDown}
                ref={containerRef}
                className="editor-new-line"
            >
                {!disableKey &&
                 <>
                     <input
                         ref={inputRef}
                         value={newItem?.key}
                         onChange={(e)=>setNewItem({key:e.target.value})}
                         placeholder='field'
                         type="text"
                     /> :
                 </>
                }

                <select
                    value={newItem.type}
                    onChange={(e)=> setNewItem({
                            type: e.target.value,
                            value: getValueByType(e.target.value)
                        })}
                >
                    <option disabled={true}>Type</option>
                    {types.map((d, i) => (
                        <option key={i} value={d.label} >
                            {d.label}
                        </option>
                    ))}
                </select>

                &nbsp;

                {(!listType && newItem.type !== 'bool') && (
                    <input
                        value={newItem?.value}
                        onChange={(e)=> setNewItem({value: e.target.value})}
                        placeholder='value'
                        type="text"
                    />
                )}

                {newItem.type === 'bool' && (
                    <select
                        value={newItem.value}
                        onChange={(e)=> setNewItem({value: e.target.value})}
                    >
                        <option value={'true'}>true</option>
                        <option value={'false'}>false</option>
                    </select>
                )}

               <div className="new-line-icons">
                   <i
                       onClick={addNewItem}
                       className="feather feather-plus add-icon"
                   />
                   <i
                       onClick={()=>setShowNewLine(false)}
                       className="feather feather-x trash-icon"
                   />
               </div>

            </div>
        </ErrorBoundary>
    )
};

