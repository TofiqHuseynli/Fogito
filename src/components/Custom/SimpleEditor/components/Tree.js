import React, {useEffect} from "react";
import {apisData} from "@actions";
import {ErrorBoundary, Inputs} from "@components";
import {App, Lang} from "@plugins";
import {useOutsideAlerter} from "@hooks";
import {NewLine} from "./";


export const Tree = ({data, state, setState, itemValue }) => {

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

    useEffect(() => {
        getTypes()
    }, [])


    const onItemAdd = (e, index, item) => {
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
                    data.splice(index + 1, 0, new_item)
                    setState({...data})
            }
            setNewLine(false);
        }
    }

    const onItemDelete = (key) => {
        data.splice(key, 1);
        setState({...data});
    }

    const onItemChange = (index, e, type) => {
        data[index][type] = e
        setState({...data})
    }


    function changeBoolean(value, index) {
        let items = data
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
                                id="dropdownMenuButton" data-toggle="dropdown" type="button"
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
                            value={item.value}
                            divClass={''}
                            style={{ boxShadow:'none' }}
                            onChange={(e) => onItemChange(index, e.target.value, 'value')}
                    />
                )
                break;
        }
    }

    function changeType(type, index) {
        let items = data
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
                {/********** Labels **********/}
                <div className='' style={{ marginRight: -10 }} >
                    <div className='d-flex _jc-end flex-column' >
                        {data.length > 0 &&
                        data.map((item,index) =>
                            <div key={index}>
                                <div className='params-inputs mt-1'>
                                    <div className='params-label' style={{width: '20%'}}>
                                        <Inputs type='input'
                                                backColor='#fff'
                                                style={{boxShadow: 'none'}}
                                                disabled={itemValue.type === 'array' && true}
                                                value={itemValue.type !== 'array' ? item.key : index }
                                                onChange={(e) => onItemChange(index, e.target.value, 'key')}
                                        />
                                    </div>
                                    <div className='params-label' style={{width: '13%'}}>
                                        <Inputs type='select'
                                                onSelect={(e) => changeType(e, index)}
                                                data={types}
                                                backColor={'#fff'}
                                                style={{ boxShadow:'none' }}
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
                                                value={item.comment}
                                                divClass={'px-2'}
                                                style={{ boxShadow:'none' }}
                                                onChange={(e)=> onItemChange(index, e.target.value, 'comment')}
                                        />
                                    </div>

                                    {/********** Child && Add / Remove **********/}
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
                                            itemValue={itemValue}
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
    )
}