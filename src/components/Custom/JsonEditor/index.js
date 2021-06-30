import React, {useEffect, useRef, useState} from 'react';

import {apisData} from "@actions";
import {NewLine, Tree} from "./components";
import {useOutsideAlerter} from "@hooks";
import {ErrorBoundary} from "@components";
import {Tooltip} from "antd";
import {App, Lang} from "@plugins";

export const JsonEditor = ({state, setState}) => {

    //  values
    const formRef = useRef();
    const [line, setLine] = useState(200)
    const [edit, setEdit] = React.useState(false)
    const [editVal, setEditVal] = React.useState(false)
    const [newLine, setNewLine] = React.useState(false)
    const [visibleBoolean, setVisibleBoolean] = React.useState(false)
    const [oneNewLine, setOneNewLine] = React.useState(false)
    const [editComment, setEditComment] = React.useState(false)
    const [newLineExample, setNewLineExample] = React.useState(false)
    const [types, setTypes] = React.useState([])
    const [create, setCreate] = useState({
        key: '',
        type: 'string',
        value: ''
    })
    const [boolean] = React.useState([
        {value: true, label: 'true'},
        {value: false, label: 'false'}
    ])

    const getTypes = async () => {
        let response = await apisData()
        if(response) {
            setTypes(response.data?.type_list)
        }
    }

    useEffect(() => {
        getTypes()
    }, [])

    // functions
    function removeLine(index) {
        setLine(line - 1)
        state.data.parameters.splice(index, 1);
        setState({...state.data.parameters});
    }

    function getLinesCount() {
        let component = [];
        for (let i = 0; i < line; i++) {
            component.push(i);
        }
        return component;
    }


    const createNew = (e, index, item) => {
        e.preventDefault()
        if (item.type !== 'array' && !create.key || !create.type) {
            // App.errorModal(Lang.get('Parameters are empty'))
        } else {
            let new_item = {
                key: create.key,
                type: create.type,
                value: create.value
            };
            switch (item.type) {
                case 'array':
                    item.value.splice(0, 0, new_item)
                    setState({...item.value})
                    break;
                case 'object':
                    item.value.splice(0, 0, new_item)
                    setState({...item.value})
                    break;
                default:
                    state.data.parameters.splice(index + 1, 0, new_item)
                    setState({...state.data.parameters})
            }
            setNewLine(!newLine)
            setLine(line + 1)
            setCreate({
                ...create,
                key: '',
                type: 'string',
                value: ''
            })
        }
    }

    const createNewOneItem = (index) => {
        if (!create.key || !create.type) {
            // App.errorModal(Lang.get('Parameters are empty'))
        } else {
            let new_item = {
                key: create.key,
                type: create.type,
                value: create.value
            }
            state.data.parameters.splice(index + 1, 0, new_item)
            setState({...state.data.parameters})
            setOneNewLine(false)
            setLine(line + 1)
        }
    }


    const onEdit = (index) => {
        let items = state.data.parameters
        items.map((item, i) => {
            if (i === index) {
                item.key = state.data.parameters[index].key
                item.value = state.data.parameters[index].value
                item.comment = state.data.parameters[index].comment
            }
        })
        setEdit(!edit)
        setEditVal(!editVal)
        setEditComment(!editComment)
    }


    function setValue(index, e, type) {
        state.data.parameters[index][type] = e
        setState({...state.data.parameters})
    }

    function createExampleLine(e, index) {
        if (!create.key || !create.type) {
            // App.errorModal(Lang.get('Parameters are empty'))
        } else {
            let items = {
                key: create.key,
                type: create.type,
                value: create.value
            }
            state.data.parameters.splice(index + 1, 0, items)
            setState({...state.data})
            setNewLineExample(false)
            setLine(line + 1)
            getNewLine(index)
        }
    }

    function changeType(type, index) {
        let items = state.data.parameters
        items.map((d,i) => {
            if (i === index) {
                d.type = type;
                switch (type) {
                    case 'array': d.value = []; break;
                    case 'object': d.value = []; break;
                    default: d.value = ''; break;
                }
            }
        })
        setState({...items})
    }


    function changeBoolean(value, index) {
        let items = state.data.parameters
        items.map((d, i) => {
            if (i === index) d.value = value
        })
        setState({...items})
    }

    // TYPE INTEGER //
    $(document).ready(function () {
        $("#integer").keypress(function (e) {
            if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                return false;
            }
        });
    });


    // VALUES
    function getValue(item, index) {
        let content = (
            <>
                {item.type !== 'boolean' &&
                    <div onClick={() => {
                           setEditVal(index);
                           setEditComment(false);
                           setEdit(false)
                         }}
                         style={{ minWidth: 10 }}
                    >
                        {
                            !item.value
                            ?
                            <div className='text-danger'>null</div>
                            :
                            <div className='d-flex' >
                                <div style={{ width: item.value.length > 50 && 200, height:16, overflow:'hidden' }} >
                                    {(((item.type !== 'array') && (item.type !== 'object')) && item.value)}
                                </div>
                                {item.value.length > 50 && '...'}
                            </div>
                        }
                    </div>
                }
            </>
        )
        switch (item.type) {
            case 'string': return (content);
            case 'integer': return (content);
            case 'float': return (content);
            case 'boolean':
                return (
                    <>
                        {  visibleBoolean === index &&
                        <Tooltip title={
                            <div className='dropdown_type'>
                                {boolean.map((d, i) =>
                                    <p className='dropdown-item fs-12 cr-pointer'
                                       key={i}
                                       onClick={() => changeBoolean(d.value, index) + setVisibleBoolean(false)}
                                    >
                                        {d.label}
                                    </p>
                                )}
                            </div>
                        }
                                 trigger={'click'}
                                 placement={'bottom'}
                                 visible={visibleBoolean}
                                 onVisibleChange={(visible) => setVisibleBoolean(visible)}
                                 overlayStyle={{minWidth: 90}}
                                 color='#FFF'
                        >
                            <div/>
                        </Tooltip>
                        }
                        <div onClick={()=> setVisibleBoolean(index)} >
                            {item.value === '' ? <div className='text-danger'>null</div> : String(item.value)}
                        </div>
                    </>
                );
            default:
        }
    }

    // RECURSIVE
    function getRecursive(item) {
        let content = (
            <Tree
                children={item.value}
                setState={setState}
                line={line}
                setLine={setLine}
                types={types}
                valueItem={item}
            />
        )
        switch (item.type) {
            case 'object': return (content);
            case 'array': return (content);
            default:
        }
    }


    // ADD VALUE
    function getValueAdd(type, item) {
        switch (type) {
            case 'object':
                return null
            case 'array':
                return null
            case 'boolean':
                return (
                    <select
                        className='badge-select'
                        onChange={(e) => setCreate({ ...create, value: String(e.target.value) })}
                    >
                        <option disabled={create.value !== false} >Type</option>
                        {boolean.map((d, i) =>
                            <option key={i} value={d.label} >{d.label}</option>
                        )}
                    </select>
                )
                break;
            case 'integer':
                return (
                    <input
                        className='badge-input'
                        name="integer" id="integer"
                        placeholder={'value'}
                        autoFocus={item.type === 'array' ? true : false}
                        value={create.value}
                        onChange={e => {
                            setCreate({...create, value: e.target.value})
                        }}
                    />
                )
            default:
                return (
                    <>
                        {type !== 'integer' &&
                            <input
                                className='badge-input'
                                placeholder={'value'}
                                autoFocus={item.type === 'array' ? true : false}
                                value={create.value}
                                onChange={e => {
                                    setCreate({...create, value: e.target.value})
                                }}
                            />
                        }
                    </>
                )
        }
    }


    function getNewLine(index) {
        setNewLine(index)
        setOneNewLine(false)
        setCreate({
            key: '',
            type: 'string',
            value: ''
        })
    }

    function getOneNewLine(index) {
        setOneNewLine(index)
        setNewLine(false)
        setCreate({
            key: '',
            type: 'string',
            value: ''
        })
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



    // this function for inputs/forms onblur
    const onCloseForm = () => {
        formRef.current.dispatchEvent(new Event('submit', { cancelable: true }))
        setNewLine(false);
        setOneNewLine(false);
        setEditVal(false)
        setEdit(false)
        setEditComment(false)
        setNewLineExample(false)
    }

    useOutsideAlerter(formRef, onCloseForm)


    return (
        <ErrorBoundary>
            <div className='input-container col-12 cr-pointer'>
                <div className='default-textarea p-0 overflow-hidden' style={{position: 'relative'}} >

                    {/*****  EDITOR's LINE NUMBERS ON THE LEFT SIDE  *****/}
                    <div className='d-flex flex-column h-100 _ai-end pl-3 pr-2'
                         style={{position: 'absolute', backgroundColor: '#E9EDEF', paddingTop:12, borderRadius: '5px 0 0 5px' }}>
                        {getLinesCount().map((item, i) => <div key={i} style={{color: '#AAA0A0', marginTop:10 }}>{item}</div>)}
                    </div>


                    {/*****  EDITOR's CONTENT  *****/}
                    <div className='pt-3 react-json_editor'>
                        <div className='d-flex editor-line _jc-between' onDoubleClick={() => setNewLineExample(true)} >
                            <div className='d-flex'>
                                <div className='text-danger'>(object)</div>
                                <div className='ml-2'>{"{"}</div>
                            </div>

                            <div className='d-flex _center' onClick={() => setNewLineExample(true)}>
                                <i className='feather feather-plus editor-line-btn mr-3'/>
                            </div>
                        </div>

                        <ExampleLine
                            {...{create, setCreate, newLineExample,
                                setNewLineExample, formRef, types,
                                getValueAdd, createExampleLine, getNewValue}}
                        />

                        <div className='ml-3'  >
                            {state.data?.parameters?.map((item, index) => (
                                <div key={index}>
                                    {/*<Tooltip title='text' trigger='contextMenu' >*/}
                                    <div className='d-flex editor-line _jc-between'
                                         onDoubleClick={()=> getNewLine(index)} style={{paddingLeft: 50}}

                                    >
                                        <div className='d-flex'>

                                            <Key {...{item, edit, index, formRef, onEdit, setValue, setEdit}} />

                                            <Type {...{item, changeType, types, index}} />  &nbsp;

                                            <Value {...{editVal, index, formRef, onEdit, item, setValue, setNewLine, getValue}} />

                                            <Comment {...{item, editComment, index, formRef, onEdit, setValue, setEditComment}} />

                                        </div>


                                        {/*****  ADD / REMOVE LINE  *****/}
                                        <div className='d-flex _center a-r__buttons'>
                                            <i className='feather feather-plus editor-line-btn mr-2' onClick={() => {
                                                setNewLine(index)
                                                setCreate({field:'', type:'string', value:''})
                                            }}/>
                                            <i className='feather feather-trash-2 text-danger editor-line-btn mr-3' onClick={() => removeLine(index)}/>
                                        </div>

                                    </div>


                                    {/* Create New */}
                                    <NewLine getValueAdd={getValueAdd}
                                             setNewLine={setNewLine}
                                             createNew={createNew}
                                             setCreate={setCreate}
                                             newLine={newLine}
                                             formRef={formRef}
                                             create={create}
                                             types={types}
                                             index={index}
                                             item={item}
                                             valueItem={item}
                                    />

                                    {/* Recursive */}
                                    {
                                        // item.children?.length &&
                                        <>
                                            {getRecursive(item)}
                                        </>
                                    }

                                    {/*****  ADD / REMOVE LINE for ONE ITEM  *****/}
                                    {item.type === 'object' &&
                                        <div style={{paddingLeft: 50}} className='editor-line _jc-between' onDoubleClick={()=> getOneNewLine(index)} >
                                            {item.type === 'object' && '}'}
                                            <div className='d-flex _center a-r__buttons'>
                                                <i className='feather feather-plus editor-line-btn mr-2' onClick={() => {
                                                    setOneNewLine(index)
                                                    setCreate({field:'', type:'string', value:''})
                                                }}/>
                                                <i className='feather feather-trash-2 text-danger editor-line-btn mr-3' onClick={() => removeLine(index)}/>
                                            </div>
                                        </div>
                                    }

                                    {/*****  ADD / REMOVE LINE for ONE ITEM  *****/}
                                    {item.type === 'array' &&
                                        <div style={{paddingLeft: 50}} className='editor-line _jc-between' onDoubleClick={()=> getOneNewLine(index)} >
                                            {item.type === 'array' && ']'}
                                            <div className='d-flex _center a-r__buttons'>
                                                <i className='feather feather-plus editor-line-btn mr-2'
                                                   onClick={() => {
                                                       setOneNewLine(index)
                                                       setCreate({field:'', type:'string', value:''})
                                                   }}
                                                />
                                                <i className='feather feather-trash-2 text-danger editor-line-btn mr-3' onClick={() => removeLine(index)}/>
                                            </div>
                                        </div>
                                    }

                                    {/* Create New One Item */}
                                    {oneNewLine === index &&
                                        <form onSubmit={() => createNewOneItem(index)} ref={formRef} className='static__width' >
                                            <div className='px-5 d-flex'>
                                                <input
                                                    className='badge-input'
                                                    placeholder={'field'}
                                                    autoFocus={true}
                                                    onChange={e => {
                                                        setCreate({...create, key: e.target.value})
                                                    }}
                                                /> :
                                                <select
                                                    className='badge-select'
                                                    defaultValue={'string'}
                                                    onChange={e => {
                                                            setCreate({...create,
                                                                key: create.key,
                                                                type: e.target.value,
                                                                value: getNewValue(e.target.value)
                                                            })
                                                        }}
                                                >
                                                    <option value='' disabled={create.type !== ''} >Type</option>
                                                    {types.map((d, i) =>
                                                        <option key={i} value={d.value} >{d.label}</option>
                                                    )}
                                                </select>
                                                {getValueAdd(create.type, false)}
                                                <button className='btn badge-ok_btn'>
                                                    ok
                                                </button>
                                                <button className='btn badge-x_btn' onClick={() => setOneNewLine(false)} >
                                                    x
                                                </button>
                                            </div>
                                        </form>
                                    }
                                    {/*</Tooltip>*/}
                                </div>
                            ))}
                        </div>
                        <div>
                            <div className='editor-line'>{"}"}</div>
                        </div>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
}


const ExampleLine = ({create ,setCreate ,newLineExample, setNewLineExample, formRef, types, getValueAdd, createExampleLine, getNewValue}) => {
    return (
        <ErrorBoundary>
            <div className='ml-3' >
                {newLineExample &&
                    <form onSubmit={(e) => createExampleLine(e)} ref={formRef} className='static__width' >
                        <div className='px-5 d-flex'>

                            <input
                                className='badge-input'
                                placeholder={'field'}
                                autoFocus={true}
                                onChange={e => {
                                    setCreate({...create, key: e.target.value})
                                }}
                            /> :

                            <select
                                className='badge-select'
                                defaultValue={'string'}
                                onChange={e => {
                                    setCreate({...create,
                                        key: create.key,
                                        type: e.target.value,
                                        value: getNewValue(e.target.value)
                                    })
                                }}
                            >
                                <option value='' disabled={create.type !== ''} >Type</option>
                                {types.map((d, i) =>
                                    <option key={i} value={d.value} >{d.label}</option>
                                )}
                            </select>
                            {getValueAdd(create.type, false)}
                            <button className='btn badge-ok_btn' >
                                ok
                            </button>
                            <button className='btn badge-x_btn' onClick={() => setNewLineExample(false)}>
                                x
                            </button>
                        </div>
                    </form>
                }
            </div>
        </ErrorBoundary>
    )
}


const Key = ({item, edit, index, formRef, onEdit, setValue, setEdit}) => {
    return (
        <ErrorBoundary>
            {
                edit === index
                    ?
                    <div className='json_edit d-flex' ref={formRef}  >
                        <form onSubmit={() => onEdit(index)} >
                            <input
                                type="text"
                                className="json_input"
                                id="inlineFormInputGroup"
                                value={item.key}
                                autoFocus={true}
                                onChange={(e) => setValue(index, e.target.value, 'key')}
                            />
                            <i className='feather feather-check'
                               onClick={() => onEdit(index)}
                            />
                        </form>
                    </div>
                    : !item.key ?
                    <div onClick={() => setEdit(index)}>
                        "field":
                    </div> :
                    <div onClick={() => setEdit(index)}>
                        {`${item.key && `"${item.key}":`}`}
                    </div>
            }
        </ErrorBoundary>
    )
}


const Type = ({item, changeType, types, index}) => {

    const [visible, setVisible] = React.useState(false)
    const style = { minWidth: 90 }

    const getTypes = () => {
        return (
            <div className='dropdown_type'  >
                {types.map((d, i) =>
                    <p className='dropdown-item fs-12 cr-pointer'
                       key={i}
                       onClick={() => changeType(d.value, index) + setVisible(false)}>
                        {d.label}
                    </p>
                )}
            </div>
        )
    }

    return (
        <ErrorBoundary>
            <div className='text-danger d-flex'>
                <Tooltip title={getTypes()}
                         trigger={'click'}
                         placement={'bottom'}
                         visible={!!visible}
                         onVisibleChange={(visible) => setVisible(visible)}
                         overlayStyle={style}
                         color='#FFF'
                >
                    ({item.type}) &nbsp;
                </Tooltip>
                <div className='text-dark'>
                    {item.type === 'object' && '{' || item.type === 'array' && '['}
                </div>
            </div>
        </ErrorBoundary>
    )
}


const Value = ({editVal, index, formRef, onEdit, item, setValue, setNewLine, getValue}) => {
    return (
        <ErrorBoundary>
            <>
                {editVal === index ? (
                    <div className='json_edit d-flex' ref={formRef} >
                        <form onSubmit={() => onEdit(index)} >
                            {item.type !== 'integer' ?
                                <>
                                    <input
                                        type="text"
                                        className="json_input"
                                        value={item.value}
                                        autoFocus
                                        onBlur={()=> setNewLine(false)}
                                        onChange={(e) => setValue(index, e.target.value, 'value')}
                                    />
                                    <i className='feather feather-check'
                                       onClick={() => onEdit(index)}/>
                                </>
                                :
                                <>
                                    <input
                                        type="text"
                                        className="json_input onlyNumber"
                                        name="integer" id="integer"
                                        value={item.value}
                                        autoFocus
                                        onChange={(e) => setValue(index, e.target.value, 'value')}
                                    />
                                    <i className='feather feather-check' onClick={() => onEdit(index)} />
                                </>
                            }
                        </form>
                    </div>
                ) : ( getValue(item, index) )
                }
            </>
        </ErrorBoundary>
    )
}


const Comment = ({item, editComment, index, formRef, onEdit, setValue,setEditComment}) => {
    return (
        <ErrorBoundary>
            <>
                {editComment === index ?
                    <div className='json_edit d-flex' ref={formRef} >
                        <form onSubmit={() => onEdit(index)} >
                            <input
                                className="json_input ml-4"
                                placeholder='Comment'
                                value={item.comment}
                                autoFocus
                                onChange={(e) => setValue(index, e.target.value, 'comment')}
                            />
                            <i className='feather feather-check' onClick={() => onEdit(index)}/>
                        </form>
                    </div>
                    : <div className='text-muted ml-3 json_comment'
                           onClick={() => setEditComment(index)}>
                        {!item.comment ?
                            <div className='text-gold'>
                                // write comment
                            </div> : `// 
                            ${item.comment.substring(0,50)}
                            ${item.comment.length > 50 ? '...' : ''}
                        `}
                    </div>
                }
            </>
        </ErrorBoundary>
    )
}