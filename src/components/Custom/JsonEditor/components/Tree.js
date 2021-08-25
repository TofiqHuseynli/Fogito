import React, {useEffect, useRef, useState} from "react";
import {useOutsideAlerter} from "@hooks";
import {ErrorBoundary} from "fogito-core-ui";
import {NewLine} from "./NewLine";
import {Tooltip} from "antd";
import {Droppable} from "react-beautiful-dnd";


export function Tree({setState, line, setLine, children, types, valueItem, valueIndex, state}) {

    const formRef = useRef();
    // values
    const [edit, setEdit] = React.useState(false)
    const [editVal, setEditVal] = React.useState(false)
    const [addTree, setAddTree] = React.useState(false)
    const [addTreeOne, setAddTreeOne] = React.useState(false)
    const [editComment, setEditComment] = React.useState(false)
    const [visibleBoolean, setVisibleBoolean] = React.useState(false)
    const [create, setCreate] = useState({
        key: '',
        type: 'string',
        value: ''
    });

    useEffect(() => {
        console.log("");
        console.log('valueindex', valueIndex, valueItem);
        console.log("");
    }, [])

    const [boolean] = React.useState([
        {value: true, label: 'true'},
        {value: false, label: 'false'}
    ])


    // functions
    function removeLine(index) {
        setLine(line - 1);
        let array = children;
        array.splice(index, 1);
        setState({array});
    }

    const createNew = (e, index, item) => {
        e.preventDefault()
        if ((valueItem.type !== 'array') && !create.type) {
                // App.errorModal(Lang.get('Reports are empty'))
        } else {
            let new_item = {
                key: create.key,
                type: create.type,
                value: create.value,
            };
            switch (item.type) {
                case 'array':
                    item.value?.splice(0, 0, new_item)
                    setState({...item.value})
                    break;
                case 'object':
                    item.value.splice(0, 0, new_item)
                    setState({...item.value})
                    break;
                default:
                    children.splice(index + 1, 0, new_item)
                    setState({...children})
            }
            setAddTree(false)
            setAddTreeOne(false)
            setCreate({
                key: '',
                type: 'string',
                value: ''
            })
            setLine(line + 1)
        }
    }

    function changeBoolean(value, index) {
        let items = children
        items.map((item, i) => {
            if (i === index) item.value = value
        })
        setState({...items})
    }

    const onEdit = (index) => {
        children.map((item, i) => {
            if (i === index) {
                item.key = children[index].key
                item.value = children[index].value
                item.comment = children[index].comment
            }
        })
        setEditComment(!editComment)
        setEdit(false)
        setEditVal(false)
    }

    function setValue(index, e, type) {
        children[index][type] = e;
        setState({...children});
    }


    // TYPE INTEGER //
    $(document).ready(function () {
        $("#quantity").keypress(function (e) {
            if(e.originalEvent.code !== 'Enter') {
                if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                    return false;
                }
            }
        });
    });


    // TYPES
    function getValue(item, index) {
        let content = (
            <>
                {item.type !== 'boolean' &&
                <div onClick={() => {
                    setEditVal(index);
                    setEditComment(false);
                    setEdit(false)
                }} style={{ minWidth: 10 }} >
                    {
                        !item.value
                            ?
                            <div className='text-danger'>null</div>
                            :
                            <div className='d-flex' >
                                <div style={{ width: item.value.length > 50 && 200, height:16, overflow:'hidden', wordBreak: 'break-all' }} >
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
            case 'integer': return (content);
            case 'string':   return (content);
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
                    // <div className='dropdown'>
                    //     <div id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    //         {item.value === '' ? <div className='text-danger'>null</div> : String(item.value)}
                    //     </div>
                    //     <div className="dropdown-menu" aria-labelledby="dropdownMenuLink" >
                    //         {boolean?.map((d, i) =>
                    //             <p className="dropdown-item" key={i} onClick={() => changeBoolean(d.value, index)}>
                    //                 {d.label}
                    //             </p>
                    //         )}
                    //     </div>
                    // </div>
                );
            default:
        }
    }


    function changeType(type, index) {
        let items = children;
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
                        d.value = d.value;
                        break;
                }

                switch (d.type) {
                    case 'array':
                        return setEditVal(false);
                    case 'object':
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
            case 'array': return (
                typeof item.value === 'string'
                    ?
                    <div className='ml-5 pl-3' >{item.value}</div>
                    :
                    (content)
            );
            default: break;
        }
    }


    // ADD VALUE
    function getValueAdd(type, item, valueItem) {
        switch (type) {
            case 'object':
                return null
            case 'array':
                return null
            case 'boolean':
                return (
                    <select
                        className='badge-select'
                        value={create.type}
                        onChange={(e) => setCreate({ ...create, value: e.target.value })}
                    >
                        <option value={true} disabled={create.value !== false} >Type</option>
                            {boolean.map((d, i) =>
                            <option key={i} value={d.value}>{d.label}</option>
                        )}
                    </select>
                )
            case 'integer':
                return (
                    <input
                        className='badge-input'
                        name="quantity"
                        id="quantity"
                        autoFocus={(item.type === 'array' ? true : false) || (valueItem.type === 'array' ? true : false)}
                        placeholder={'value'}
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
                                autoFocus={
                                    checkFocus(item, valueItem)
                                    // item.type === 'array' ? true : false
                                }
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

    const checkFocus = (item, valueItem) => {
        switch (item.type) {
            case 'array':
                return true
            case 'object':
                return false
        }

        switch (valueItem.type) {
            case 'array':
                return true
            case 'object':
                return false
        }
    }



    const getNewLine = (index) => {
        setAddTree(index)
        setCreate({
            key: '',
            type: 'string',
            value: ''
        })
    }

    const getOneNewLine = (index) => {
        setAddTreeOne(index)
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

        setEditComment(false)
        setEdit(       false)
        setAddTree(    false)
        setAddTreeOne( false)
        setEditVal(    false)
    }

    useOutsideAlerter(formRef, onCloseForm)

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };


    return(
        <Droppable droppableId={valueIndex+'_'} direction="vertical" type="children" >
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {
                            children.length > 0 && children?.map((item, index) => {
                                let uniqe_key = item.key+'_val_'+index;
                                return (
                                    // <Draggable
                                    //     key={index}
                                    //     draggableId={uniqe_key}
                                    //     index={index}
                                    // >
                                    //     {(provided, snapshot) => (
                                            <div
                                                className='pl-5'
                                                // className={classNames("task pl-5", { dragging: snapshot.isDragging })}
                                            >
                                                <div key={index} className='d-flex editor-line _jc-between'
                                                     style={{ position: 'relative' }}
                                                     onDoubleClick={()=> getNewLine(index)} >
                                                    <div className='d-flex' onDoubleClick={(e)=> e.stopPropagation()} >

                                                        {/*****  KEY  *****/}
                                                        <input
                                                            className={`is_required text-light ${children[index].is_required ? 'active' : '' }`}
                                                            type='checkbox'
                                                            onChange={(e)=> setValue(index, !!e.target.checked ? 1 : 0, 'is_required') + console.log('test')}
                                                        />
                                                        {
                                                            edit === index ? (
                                                                    <form onSubmit={() => onEdit(index)} ref={formRef} >
                                                                        <div className='json_edit d-flex'>
                                                                            <input
                                                                                type="text"
                                                                                className="json_input"
                                                                                id="inlineFormInputGroup"
                                                                                value={item.key}
                                                                                autoFocus={true}
                                                                                onChange={(e) => setValue(index, e.target.value, 'key')}
                                                                            />
                                                                            <i className='feather feather-check' onClick={() => onEdit(index)}/>
                                                                        </div>
                                                                    </form>
                                                                ) :
                                                                !item.key
                                                                    ?
                                                                    <>
                                                                        {
                                                                            valueItem.type !== 'array'
                                                                                ?
                                                                                <div onClick={() => setEdit(index)}>
                                                                                    "field:"
                                                                                </div>
                                                                                :
                                                                                <div>
                                                                                    {`"${index}":`}
                                                                                </div>
                                                                        }
                                                                    </>
                                                                    :
                                                                    <div onClick={() => setEdit(index)}>
                                                                        {`${item.key && `"${item.key}":`}`}
                                                                    </div>
                                                        }

                                                        &nbsp;


                                                        {/* Type */}
                                                        <Type {...{item, types, changeType, index}} />

                                                        &nbsp;

                                                        {/*****  VALUE  *****/}
                                                        {editVal === index ? (
                                                            <div className='json_edit d-flex' ref={formRef} >
                                                                <form onSubmit={() => onEdit(index)} >
                                                                {item.type !== 'integer' ?
                                                                    <form onSubmit={() => onEdit(index)} >
                                                                        <input
                                                                            type="text"
                                                                            className="json_input"
                                                                            value={item.value}
                                                                            autoFocus
                                                                            onChange={(e) => setValue(index, e.target.value, 'value')}
                                                                        />
                                                                        <i className='feather feather-check'
                                                                           onClick={() => onEdit(index)}/>
                                                                    </form>
                                                                    :
                                                                    <>
                                                                        <input
                                                                            type="text"
                                                                            className="json_input"
                                                                            name="quantity"
                                                                            id="quantity"
                                                                            value={item.value}
                                                                            autoFocus
                                                                            onChange={(e) => setValue(index, e.target.value, 'value')}
                                                                        />
                                                                        <i className='feather feather-check'
                                                                           onClick={() => onEdit(index)}/>
                                                                    </>
                                                                }
                                                                </form>
                                                            </div>
                                                        ) : (
                                                            getValue(item, index)
                                                        )}

                                                        <div className="dropdown ml-auto">
                                                            <div className="dropdown-menu" style={{marginRight: '6em'}}
                                                                 aria-labelledby="dropdownMenuButton">
                                                                {boolean?.map((d, i) =>
                                                                    <p className="dropdown-item" key={i} onClick={() => changeBoolean(d.value, index)} >
                                                                        {d.label}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/*****  COMMENT  *****/}
                                                        {editComment === index ?
                                                            <form onSubmit={() => onEdit(index)} ref={formRef} >
                                                                <div className='json_edit d-flex'>
                                                                    <input
                                                                        className="json_input ml-4  "
                                                                        placeholder='Comment'
                                                                        value={item.comment}
                                                                        autoFocus
                                                                        onChange={(e) => setValue(index, e.target.value, 'comment')}
                                                                    />
                                                                    <i className='feather feather-check' onClick={() => onEdit(index)}/>
                                                                </div>
                                                            </form>
                                                            : <div className='text-muted ml-3 json_comment' onClick={() => {setEditComment(index); setEditVal(false); setEdit(false);}}>
                                                                {!item.comment ? <div className='text-gold'>// write comment</div> : `// ${item.comment}`}
                                                            </div>
                                                        }
                                                    </div>

                                                    {/*****  ADD / REMOVE LINE  *****/}
                                                    <div className='d-flex _center a-r__buttons'>
                                                        <i className='feather feather-plus editor-line-btn mr-2' onClick={() => {
                                                            setAddTree(index)
                                                            setCreate({field:'', type:'string', value:''})
                                                        }}/>
                                                        <i className='feather feather-trash-2 text-danger editor-line-btn mr-3'
                                                           onClick={() => removeLine(index)} />
                                                    </div>
                                                </div>


                                                {/*****  CREATE NEW  *****/}
                                                <NewLine getValueAdd={getValueAdd}
                                                         setNewLine={setAddTree}
                                                         createNew={createNew}
                                                         setCreate={setCreate}
                                                         newLine={addTree}
                                                         formRef={formRef}
                                                         create={create}
                                                         types={types}
                                                         index={index}
                                                         item={item}
                                                         valueItem={valueItem}
                                                />



                                                {/*****  RECURSIVE  *****/}
                                                {getRecursive(item)}


                                                {item.type === 'array' &&
                                                <div style={{paddingLeft: 100}} className='editor-line _jc-between' onDoubleClick={()=> getOneNewLine(index)} >
                                                    <div style={{ marginLeft: -45 }} >{item.type === 'array' && ']'}</div>
                                                    {/*****  ADD / REMOVE LINE  *****/}
                                                    <div className='d-flex _center a-r__buttons'>
                                                        <i className='feather feather-plus editor-line-btn mr-2'
                                                           onClick={() => {
                                                               setAddTreeOne(index)
                                                               setCreate({field:'', type:'string', value:''})
                                                           }}
                                                        />
                                                        <i className='feather feather-trash-2 text-danger editor-line-btn mr-3'
                                                           onClick={() => removeLine(index)}/>
                                                    </div>
                                                </div>
                                                }
                                                {item.type === 'object' &&
                                                <div style={{paddingLeft: 100}} className='editor-line _jc-between' onDoubleClick={()=> getOneNewLine(index)} >
                                                    <div style={{ marginLeft: -45 }} >{item.type === 'object' && '}'}</div>
                                                    {/*****  ADD / REMOVE LINE  *****/}
                                                    <div className='d-flex _center a-r__buttons'>
                                                        <i className='feather feather-plus editor-line-btn mr-2'
                                                           onClick={() => {
                                                               setAddTreeOne(index)
                                                               setCreate({field:'', type:'string', value:''})
                                                           }}
                                                        />
                                                        <i className='feather feather-trash-2 text-danger editor-line-btn mr-3'
                                                           onClick={() => removeLine(index)}/>
                                                    </div>
                                                </div>
                                                }
                                                {/*****  CREATE NEW  *****/}
                                                {addTreeOne === index &&
                                                <form onSubmit={(e) => {
                                                    e.preventDefault()
                                                    if (!create.type) {
                                                        // Api.errorModal('Parameters are empty')
                                                    } else {
                                                        let new_item = {
                                                            key: create.key,
                                                            type: create.type,
                                                            value: create.value,
                                                        };
                                                        children.splice(index + 1, 0, new_item)
                                                        setState({...children})
                                                        setAddTreeOne(false)
                                                        setLine(line + 1)
                                                    }
                                                }}
                                                      ref={formRef}
                                                      className='static__width'
                                                >
                                                    <div className='pl-5 ml-2 d-flex'>
                                                        {
                                                            valueItem.type !== 'array' &&
                                                            <>
                                                                <input
                                                                    className='badge-input'
                                                                    placeholder={'field'}
                                                                    value={create.key}
                                                                    autoFocus={true}
                                                                    onChange={e => {
                                                                        setCreate({...create, key: e.target.value})
                                                                    }}
                                                                /> :
                                                            </>
                                                        }
                                                        <select
                                                            className='badge-select'
                                                            defaultValue={'string'}
                                                            value={create.type}
                                                            onChange={e => {
                                                                setCreate({...create,
                                                                    // key: (e.target.value === 'array') ? '' : create.key,
                                                                    key: create.key,
                                                                    type: e.target.value,
                                                                    value: getNewValue(e.target.value)
                                                                });
                                                            }}
                                                        >
                                                            <option value=''>Type</option>
                                                            {types.map((d, i) =>
                                                                <option key={i} value={d.value}>{d.label}</option>
                                                            )}
                                                        </select>
                                                        {getValueAdd(create.type, valueItem, false)}
                                                        <button className='btn badge-ok_btn'>ok</button>
                                                        <button className='btn badge-x_btn' onClick={() => setAddTreeOne(false)}>
                                                            x
                                                        </button>
                                                    </div>
                                                </form>
                                                }
                                            </div>
                                    // {/*        </div>*/}
                                    // {/*    )}*/}
                                    // {/*</Draggable>*/}
                                )
                                }
                            )
                        }
                    </div>
                )}
            </Droppable>
        // </DragDropContext>
    )
}





const Type = ({item, types, changeType, index}) => {

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