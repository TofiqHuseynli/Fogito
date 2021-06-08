import React from 'react';
import {ErrorBoundary} from "@components";

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
        childItem
    }) => {


    const getKey = () => {
        if (item.type === 'array') {
            return <div/>
        } else if (item.type === 'object') {
            return (
                <>
                    <input
                        className='badge-input'
                        placeholder={'field'}
                        autoFocus={true}
                        onChange={e => {
                            setCreate({...create, key: e.target.value})
                        }}
                    /> :
                </>
            )
        } else if (valueItem.type === 'array') {
            return <div/>
        } else if (valueItem.type === 'array' && item.type === 'object') {
            return (
                <>
                    <input
                        className='badge-input'
                        placeholder={'field'}
                        autoFocus={true}
                        onChange={e => {
                            setCreate({...create, key: e.target.value})
                        }}
                    /> :
                </>
            )
        } else {
            return (
                <>
                    <input
                        autoFocus={true}
                        className='badge-input'
                        placeholder={'field'}
                        onChange={e => {
                            setCreate({...create, key: e.target.value})
                        }}
                    /> :
                </>
            )
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
                            // autoFocus={true}
                        >
                            <option value='' disabled={create.type !== ''}>Type</option>
                            {types.map((d, i) =>
                                <option key={i} value={d.value}>{d.label}</option>
                            )}
                        </select>
                            {getValueAdd(create.type, item, valueItem)}
                        <button className='btn badge-ok_btn'  >
                            ok
                        </button>
                        <button className='btn badge-x_btn' onClick={() => setNewLine(false)}>
                            x
                        </button>

                    </form>
            }
        </ErrorBoundary>
    )
}
