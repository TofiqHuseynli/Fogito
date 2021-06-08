import React from "react";
import {ErrorBoundary, Inputs} from "@components";


export const NewLine = ({ item, index, create, setCreate, onItemAdd, setNewLine, types, boolean, itemValue }) => {


    function changeBoolean(value, index) {
        let items = create
        items.value = value;
        setCreate({...items})
    }



    const getValue = (index) => {
        switch (create.type) {
            case 'array':
                return (<div />);
                break;
            case 'object':
                return (<div />)
                break;
            case 'boolean':
                return (
                    <div className="dropdown" style={{width:'100%'}} >
                        <Inputs type='select'
                                onSelect={(e) => changeBoolean(e.target.value, index)}
                                data={boolean}
                                backColor={'#fff'}
                                style={{ boxShadow:'none' }}
                                propsClass={'custom-input'}
                                divClass={'px-2'}
                        />
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
                                   style={{ boxShadow:'none' }}
                                   onChange={(e)=> setCreate({...create, value: e.target.value})}
                            />
                        </div>
                    </div>
                )
            default:
                return (
                    <Inputs type='input'
                            backColor='#fff'
                            style={{ boxShadow:'none' }}
                            onChange={(e)=> setCreate({...create, value: e.target.value})}
                    />
                )
                break;
        }
    }



    const renderKey = () => {
        if(item.type !== 'array' && itemValue.type !== 'array') {
            return (
                <Inputs type='input'
                        backColor='#fff'
                        autoFocus={true}
                        onChange={(e)=> setCreate({...create, key: e.target.value})}
                        style={{ boxShadow:'none' }}
                />
            )
        } else if (item.type === 'object') {
            return (
                <Inputs type='input'
                        backColor='#fff'
                        autoFocus={true}
                        onChange={(e)=> setCreate({...create, key: e.target.value})}
                        style={{ boxShadow:'none' }}
                />
            )
        }
    }


    return (
        <ErrorBoundary>
            <form onSubmit={(e)=> e.preventDefault() + onItemAdd(index, item)} className='params-inputs border border-black'  >
                    <div className='params-label' style={{width: '20%'}}>
                        {renderKey()}
                    </div>
                    <div className='params-label' style={{width: '13%'}}>
                        <Inputs type='select'
                                onSelect={e => {
                                    setCreate({...create,
                                        key: (e.target.value === 'array') && '',
                                        type: e.target.value,
                                        value: (e.target.value === 'object' || 'array') && []});
                                    }
                                }
                                data={types}
                                backColor={'#fff'}
                                propsClass={'custom-input'}
                                divClass={'px-2'}
                                selected={'string'}
                        />
                    </div>
                    <div className='params-label' style={{width: '27%'}}>
                        {getValue(index)}
                    </div>
                    <div className='params-label' style={{width: '27%'}}>
                        {/*<Inputs type='input'*/}
                        {/*        backColor='#fff'*/}
                        {/*        divClass={'px-2'}*/}
                        {/*        onChange={(e)=> setCreate({...create, comment: e.target.value})}*/}
                        {/*        style={{ boxShadow:'none' }}*/}
                        {/*/>*/}
                    </div>

                    {/********** Child && Add / Remove **********/}
                    <div className='params-label d-flex justify-content-between align-items-center' style={{width: '10%'}}>
                        <Inputs type='checkbox'
                        />
                        <i className='feather feather-check text-success' style={{ fontSize:20 }} onClick={ (e)=> onItemAdd(e,index,item)}  />
                        <i className='feather feather-minus text-danger' style={{ fontSize:20 }} onClick={()=> setNewLine(false)} />
                    </div>
            </form>
        </ErrorBoundary>
    )
}