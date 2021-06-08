import React from 'react';

import {ErrorBoundary, Inputs} from "@components";
import {NewLine, Tree} from './components';
import {apisData} from "@actions";
import {App, Lang} from "@plugins";
import {useOutsideAlerter} from "@hooks";

export const SimpleEditor = ({state, setState}) => {

    const [newLine, setNewLine] = React.useState(false)
    const [types, setTypes] = React.useState([])
    const [create, setCreate] = React.useState({
        key: '',
        type: 'string',
        value: ''
    })
    const [boolean] = React.useState([
        {value: true, label: 'true'},
        {value: false, label: 'false'}
    ])
    const formRef = React.useRef();

    const getTypes = async () => {
        let response = await apisData()
        if(response) {
            setTypes(response.data?.type_list)
        }
    }

    React.useEffect(() => {
        getTypes()
    }, [])



    const onItemAdd = (index, item) => {
        if (create.type !== 'array' && !create.type) {
            App.errorModal(Lang.get('Reports are empty'))
        } else {
            let new_item = {
                key: create.key,
                type: create.type,
                value: create.value
            };
            switch (item.type) {
                case 'array':
                    item.value.splice(index + 1, 0, new_item)
                    setState({...item.value})
                    break;
                case 'object':
                    item.value.splice(index + 1, 0, new_item)
                    setState({...item.value})
                    break;
                default:
                    state.data.parameters.splice(index + 1, 0, new_item)
                    setState({...state.data.parameters})
            }
            setNewLine(false);
        }
    }

    const onItemDelete = (key) => {
        state.data.parameters.splice(key, 1);
        setState({...state.data.parameters});
    }

    const onItemChange = (index, e, type) => {
        state.data.parameters[index][type] = e
        setState({...state.data.parameters})
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
        $("#quantity").keypress(function (e) {
            if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                return false;
            }
        });
    });


    const getValue = (item, index) => {
        switch (item.type) {
            case 'array':
                return(<div />);
                break;
            case 'object':
                return (<div />)
                break;
            case 'boolean':
                return (
                    <div className="dropdown" style={{width:'100%'}} >
                        <button className="btn btn-white dropdown-toggle d-flex justify-content-between align-items-center"
                                id="dropdownMenuButton" data-toggle="dropdown"
                                type="button"
                                style={{width:'100%'}}  >
                            {item.value === '' ? <div>select</div> : String(item.value)}
                        </button>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            {boolean?.map((d, i) =>
                                <p className="dropdown-item" key={i} onClick={() => changeBoolean(d.value, index)}>
                                    {d.label}
                                </p>
                            )}
                        </div>
                    </div>
                )
                break;
            case 'integer':
                return (
                    <div className='col p-0' >
                        <div className='input-container' >
                            <input type='input'
                                   className='form-control form-control-alternative custom-input bg-white'
                                   name="quantity" id="quantity"
                                   value={item.value}
                                   style={{ boxShadow:'none' }}
                                   onChange={(e) => onItemChange(index, e.target.value, 'value')}
                            />
                        </div>
                    </div>
                )
            default:
                return (
                    <Inputs type='input'
                            backColor='#fff'
                            style={{ boxShadow:'none' }}
                            value={item.value}
                            onChange={(e) => onItemChange(index, e.target.value, 'value')}
                    />
                )
                break;
        }
    }

    function changeType(type, index) {
        let items = state.data.parameters
        items.map((d,i) => {
            if (i === index) {
                d.type = type.target.value;
                switch (type.target.value) {
                    case 'array': d.value = []; break;
                    case 'object': d.value = []; break;
                    default: d.value = ''; break;
                }
            }
        })
        setState({...items})
    }

    // this function for inputs/forms onblur
    const onCloseForm = () => {
        formRef.current.dispatchEvent(new Event('submit', { cancelable: true }))
        setNewLine(false);
    }

    useOutsideAlerter(formRef, onCloseForm)


    return (
        <ErrorBoundary>
            <div className='col-12' >
                <div className='row' >
                    <div className='col' >
                        {/********** Labels **********/}
                        <div className='params-section' >
                            <div className='params-label' style={{ width:'20%' }} >
                                <p>{Lang.get("Parameter")}</p>
                            </div>
                            <div className='params-label' style={{ width:'15%' }} >
                                <p>{Lang.get("Type")}</p>
                            </div>
                            <div className='params-label' style={{ width:'27%' }} >
                                <p>{Lang.get("Default Value")}</p>
                            </div>
                            <div className='params-label' style={{ width:'27%' }} >
                                <p>{Lang.get("Comment")}</p>
                            </div>
                            <div className='params-label' style={{ width:'10%' }} >
                                <p>{Lang.get("*Req")}</p>
                            </div>
                        </div>

                        {/********** Inputs **********/}
                        {state.data.parameters.length > 0 &&
                        state.data.parameters.map((item,index) =>
                            <div key={index}>
                                <div className='params-inputs'>
                                    <div className='params-label' style={{width: '20%'}}>
                                        <Inputs type='input'
                                                backColor='#fff'
                                                value={item.key}
                                                style={{ boxShadow:'none'}}
                                                onChange={(e)=> onItemChange(index, e.target.value, 'key')}
                                        />
                                    </div>
                                    <div className='params-label' style={{width: '13%'}}>
                                        <Inputs type='select'
                                                onSelect={(e) => changeType(e, index)}
                                                data={types}
                                                backColor={'#fff'}
                                                propsClass={'custom-input'}
                                                divClass={'px-2'}
                                                selected={item.type}
                                        />
                                    </div>
                                    <div className='params-label' style={{width: '27%'}}>
                                        {getValue(item, index)}
                                    </div>
                                    <div className='params-label' style={{width: '27%'}}>
                                        <Inputs type='input'
                                                backColor='#fff'
                                                divClass={'px-2'}
                                                value={item.comment}
                                                style={{ boxShadow:'none' }}
                                                onChange={(e)=> onItemChange(index, e.target.value, 'comment')}
                                        />
                                    </div>

                                    {/********** Parent && Add / Remove **********/}
                                    <div className='params-label d-flex justify-content-between align-items-center' style={{width: '10%'}}>
                                        <Inputs type='checkbox'
                                        />
                                        <i className='feather feather-plus text-light' style={{ fontSize:20 }} onClick={()=> setNewLine(index)} />
                                        <i className='feather feather-trash-2 text-danger' style={{ fontSize:20 }} onClick={()=> onItemDelete(index)} />
                                    </div>
                                </div>
                                {
                                    newLine === index &&
                                    <div ref={formRef} >
                                        <NewLine
                                            itemValue={item}
                                            item={item}
                                            index={index}
                                            create={create}
                                            types={types}
                                            boolean={boolean}
                                            setCreate={setCreate}
                                            onItemAdd={onItemAdd}
                                            setNewLine={setNewLine}
                                        />
                                    </div>
                                }
                                {item.type === 'array'  &&  <Tree state={state} setState={setState} data={item.value} itemValue={item} />}
                                {item.type === 'object' &&  <Tree state={state} setState={setState} data={item.value} itemValue={item} />}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
}
