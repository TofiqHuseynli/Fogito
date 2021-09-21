import React, {useEffect, useRef, useState} from 'react';
import {apisData} from "@actions";
import {NewLine, Tree} from "./components";
import {useOutsideAlerter} from "@hooks";
import {ErrorBoundary} from "fogito-core-ui";
import {Tooltip} from "antd";
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import classNames from 'classnames'

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
    const [columns, setColumns] = React.useState([]);

    const getTypes = async () => {
        let response = await apisData()
        if(response) {
            setTypes(response.data?.type_list)
        }
    }

    useEffect(() => {
        getTypes()
    }, [])

    useEffect(()=> {
        setColumns(state.data.parameters)
    },[state.data.parameters])


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
            // document.addEventListener('keydown', e => {
            //     if (e.code === 'Enter') {
            //         setNewLine(index)
            //     } else {
            //         setNewLine(!newLine)
            //     }
            // })
            setNewLine(!newLine)
            setLine(line + 1)
            emptyValues()
        }
    }

    const createNewOneItem = (e, index) => {
        e.preventDefault();
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
            emptyValues()
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
        e.preventDefault();
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
            emptyValues()
        }
    }

    function changeType(type, index) {
        let items = state.data.parameters;
        items.map((d,i) => {
            if (i === index) {
                d.type = type;
                switch (type) {
                    case 'array':
                        d.value = [];
                        break;
                    case 'object':
                        if (typeof d.value === 'string') {
                            d.value = []
                        }
                        break;
                    case 'boolean':
                        d.value = false;
                        break;
                    default:
                        d.value = ''
                        break;
                }

                switch (d.type) {
                    case 'array':
                        d.value = [];
                        return setEditVal(false);
                    case 'object':
                        if (typeof d.value === 'string') {
                            d.value = []
                        }
                        return setEditVal(false);
                    case 'boolean':
                        d.value = '';
                        return setEditVal(false);
                    case 'string':
                        d.value = d.value;
                        return setEditVal(index);
                    case 'float':
                        d.value = d.value;
                        return setEditVal(index);
                    default:
                        d.value = '';
                        return setEditVal(index);
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
            if(e.originalEvent.code !== 'Enter') {
                if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                    return false;
                }
            }
        });
    });

    const emptyValues = () => {
        setCreate({
            key: '',
            type: 'string',
            value: ''
        })
    }


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
                                <div style={{ width: item.value.length > 50 && 200, height:17, overflow:'hidden', wordBreak: 'break-all' }} >
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
                            <div onClick={()=> setVisibleBoolean(index)} >
                                {item.value === '' ? <div className='text-danger'>null</div> : String(item.value)}
                            </div>
                        </Tooltip>
                    </>
                );
            default:
                return (content);
        }
    }

    // RECURSIVE
    function getRecursive(item,uniqe_key) {
        let content = (
            <Tree
                state={state}
                children={item.value}
                setState={setState}
                line={line}
                setLine={setLine}
                types={types}
                valueItem={item}
                valueIndex={uniqe_key}
            />
        )
        switch (item.type) {
            case 'object': return (content);
            case 'array': return (
                typeof item.value === 'string'
                    ?
                    <div className='ml-5 pl-3' >{item.value}</div>
                    :
                    (content)
            );
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


    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    async function onDragEnd(result) {
        console.log('result',result)
        const columns = state.data.parameters;
        if (!result.destination) return;

        // if (
        //     result.destination.droppableId === result.source.droppableId &&
        //     result.destination.index === result.source.index
        // ) { return; }

        if (result.type === "children") {
            let columnFrom = columns.find((item, index) => item.key+'_'+index+'__' === result.source.droppableId);
            console.log('columnsss', columnFrom)
            console.log('result.source.droppableId', result.source.droppableId)
            let columnTo = columns.find(
                (item, index) => item.key+'_'+index+'__' === result.destination.droppableId
            );
            let i = result.destination.droppableId.slice(-3, -2);
            let sorted = Array.from(columnFrom.value);
            const items = reorder(
                sorted,
                result.source.index,
                result.destination.index
            );
            let data = state.data.parameters[i].value = items
            setState({...data});
            console.log('sort', sorted)
            // console.log('sort', card)
            console.log('iddd', i)
        } else {
            const items = reorder(
                state.data.parameters,
                result.source.index,
                result.destination.index
            );
            let data = state.data.parameters = items
            setState({...data});
        }
    }

    console.log(state.data.parameters)

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
            <div className='col-12 cr-pointer'>
                <div className='default-textarea p-0 overflow-hidden' style={{position: 'relative'}} >

                    {/*****  EDITOR's LINE NUMBERS ON THE LEFT SIDE  *****/}
                    <div className='editor-count d-flex flex-column h-100 _ai-end pl-3 pr-2'
                         style={{
                             position: 'absolute',
                             paddingTop: 3,
                             borderRadius: '5px 0 0 5px',
                             zIndex: 10,
                             userSelect: 'none'
                         }}
                    >
                        {getLinesCount().map((item, i) => <div key={i} style={{color: '#AAA0A0', marginTop:10 }}>{item}</div>)}
                    </div>


                    {/*****  EDITOR's CONTENT  *****/}
                    <div className='react-json_editor py-2'>
                        <div className='d-flex editor-line _jc-between'
                             onDoubleClick={() => setNewLineExample(true)}
                        >
                            <div className='d-flex'>
                                <div className='type'>(object)</div>
                                <div className='ml-2'>{"{"}</div>
                            </div>

                            <div className='d-flex' >
                                <div className='d-flex _center' onClick={() => setNewLineExample(true)}>
                                    <i className='feather feather-plus editor-line-btn mr-3'/>
                                </div>
                            </div>
                        </div>

                        <ExampleLine
                            {...{create, setCreate, newLineExample,
                                setNewLineExample, formRef, types,
                                getValueAdd, createExampleLine, getNewValue}}
                        />

                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="params"
                                       direction="vertical"
                                       type="parent"
                            >
                                {(provided) => (
                                    <div style={{ marginLeft: '1.2rem' }}
                                         {...provided.droppableProps}
                                         ref={provided.innerRef}
                                    >
                                        {state.data?.parameters?.map((item, index) => {
                                            let uniqe_key = item.key+'_'+index+'_';
                                            return(
                                                <Draggable
                                                    key={uniqe_key}
                                                    draggableId={uniqe_key}
                                                    index={index}
                                                >
                                                    {(provided, snapshot) => (
                                                        <div className={classNames("column d-flex flex-column", {
                                                            dragging: snapshot.isDragging,
                                                        })}
                                                             ref={provided.innerRef}
                                                             {...provided.draggableProps}
                                                             {...provided.dragHandleProps}
                                                        >
                                                            <div className='d-flex editor-line _jc-between'
                                                                 onDoubleClick={()=> getNewLine(index)} style={{ paddingLeft: 50, position: 'relative' }}
                                                            >
                                                                <div className='d-flex'>

                                                                    <Key {...{item, edit, index, formRef, onEdit, setValue, setEdit, state}} />

                                                                    <Type {...{item, changeType, types, index}} />  &nbsp;

                                                                    <Value {...{editVal, index, formRef, onEdit, item, setValue, setNewLine, getValue}} />

                                                                    <Comment {...{item, editComment, index, formRef, onEdit, setValue, setEditComment}} />

                                                                </div>


                                                                {/*****  ADD / REMOVE LINE  *****/}
                                                                <div className='d-flex _center a-r__buttons'>
                                                                    <i className='feather feather-plus editor-line-btn mr-2' onClick={(e) => {
                                                                        setNewLine(index)
                                                                        setCreate({field:'', type:'string', value:''})
                                                                    }}/>
                                                                    <i className='feather feather-trash-2 text-danger editor-line-btn mr-3'
                                                                       onDoubleClick={(e)=> e.stopPropagation() + setNewLine(false)}
                                                                       onClick={() => removeLine(index)}/>
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
                                                                <>
                                                                    {getRecursive(item,uniqe_key)}
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
                                                            <form onSubmit={(e) => createNewOneItem(e,index)} ref={formRef} className='static__width' >
                                                                <div className='px-5 d-flex'>
                                                                    <input
                                                                        className='badge-input'
                                                                        placeholder={'field'}
                                                                        autoFocus={true}
                                                                        value={create.key}
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
                                                        </div>
                                                    )}
                                                </Draggable>
                                            )

                                            }
                                        )}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                        <div>
                            <div className='editor-line'>{"}"}</div>
                        </div>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
}

export const Column = ({item, index}) => {
    return (
        <Draggable
            key={item.key}
            draggableId={item.key}
            index={index}
        >
            {(provided, snapshot) => (
                <div className={classNames("column bg-white d-flex flex-column", {
                        dragging: snapshot.isDragging,
                    })}
                     ref={provided.innerRef}
                     {...provided.draggableProps}
                     {...provided.dragHandleProps}
                >
                    {item.key}
                </div>
            )}
        </Draggable>
    )
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
                                value={create.key}
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


const Key = ({item, edit, index, formRef, onEdit, setValue, setEdit, state}) => {
    return (
        <ErrorBoundary>
            <input
                className={`is_required text-light ${state.data.parameters[index].is_required ? 'active' : '' }`}
                type='checkbox'
                onChange={(e)=> setValue(index, !!e.target.checked ? 1 : 0, 'is_required')}
            />
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
            <div className='type d-flex'>
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
                                        className="json_input"
                                        name="integer"
                                        id="integer"
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