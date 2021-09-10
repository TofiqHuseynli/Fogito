import React from 'react';
import {Lang, ErrorBoundary} from "fogito-core-ui";

export const NewLine = ({
        getValueAdd,
        setNewLine,
        createNew,
        setCreate,
        newLine,
        formRef,
        create,
        types,
        index,
        item,
        valueItem,
    }) => {

    const getKey = () => {
        let content = (
            <>
                <input
                    autoFocus={true}
                    className='badge-input'
                    placeholder={'field'}
                    value={create.key}
                    onChange={e => {
                        setCreate({...create, key: e.target.value})
                    }}
                /> :
            </>
        )
        if (item.type === 'array') {
            return <div/>
        } else if (item.type === 'object') {
            return content;
        } else if (valueItem.type === 'array') {
            return <div/>
        } else if (valueItem.type === 'array' && item.type === 'object') {
            return content;
        } else {
            return content
        }
    }


    const getNewValue = (type) => {
        switch (type) {
            case 'array':
                return []
            case 'object':
                return []
            case 'boolean':
                return true
            default:
                return ''
        }
    }


    return (
        <ErrorBoundary>
            {
                newLine === index &&
                    <form className='px-5 d-flex static__width'
                          ref={formRef}
                          onSubmit={(e) => createNew(e, index, item)}
                    >

                        {getKey()}

                        <select
                            className='badge-select'
                            defaultValue={'string'}
                            onChange={e => {
                                setCreate({
                                    ...create,
                                    key: create.key,
                                    type: e.target.value,
                                    value: getNewValue(e.target.value)
                                });
                            }}
                        >
                            <option value='' disabled={create.type !== ''}>{Lang.get("Type")}</option>
                            {types.map((d, i) =>
                                <option key={i} value={d.value}>{d.label}</option>
                            )}
                        </select>
                            {getValueAdd(create.type, item, valueItem)}
                        <button className='btn badge-ok_btn'  >
                            {Lang.get("ok")}
                        </button>
                        <button className='btn badge-x_btn' onClick={() => setNewLine(false)}>
                            x
                        </button>

                    </form>
            }
        </ErrorBoundary>
    )
}
