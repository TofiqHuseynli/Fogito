import React  from 'react';
import {ErrorBoundary, Lang, Table} from "fogito-core-ui";
import {genUuid} from "@plugins";

export function SettingsTab({data, setData,title}) {

    const columns = [
        {
            name: Lang.get("Key"),
            width: 150,
            render: (data) => {
                return (
                    <input
                        type="text"
                        className='w-100'
                        onChange={(e)=>onChangeData('key',e.target.value,data.id)}
                        value={data.key}
                        placeholder={Lang.get('Key')}
                    />
                )
            }
        },
        {
            name: Lang.get("Value"),
            render: (data) => {
                return (
                    <input
                        type="text"
                        className='w-100'
                        onChange={(e)=>onChangeData('value',e.target.value,data.id)}
                        value={data.value}
                        placeholder={Lang.get('Value')}
                    />
                )
            }
        },
        {
            width: 10,
            render: (data) => {
                return (
                    <i
                        onClick={()=>{onDeleteItem(data.id)}}
                        className="feather feather-x text-danger fs-14 cursor-pointer delete-btn"
                    />
                )
            }
        },
    ];


    const onSelect = (id) => {
        setData(data.map(item=> item.id === id ? {...item,selected: !item.selected} : item ))
    }

    const onChangeData = (key, value, currentId) => {
        setData(data.map(item=> item.id === currentId ? {...item,[key]: value} : item ))
    }

    const onAddItem = () => {
        let newItem = {
            id: genUuid(),
            key: '',
            value: '',
            selected: true,
        };

        setData([...data,newItem])
    }

    const onDeleteItem = (deleteId) => {
        setData(data.filter(item=> item.id !== deleteId))
    }

    const getSelectedIds = () =>{
        let selectedIds = [];
        data.forEach(item=>{
            if (item.selected)
                selectedIds.push(item.id)
        })

        return selectedIds;
    }

    return (
        <ErrorBoundary>
            <div className="d-flex justify-content-between align-items-center">
                {title && <h4 className='m-0'>{Lang.get('Headers')}</h4>}

                &nbsp;
                <button
                    className="btn btn-primary btn-sm m-0 my-2"
                    onClick={()=>onAddItem()}
                >
                    <i className="feather feather-plus fs-20 align-middle"/>
                </button>
            </div>
            <Table
                data={data}
                columns={{all: columns}}
                className='editable-row-table'
                select={{
                    selectedIDs: getSelectedIds(),
                    onSelect: onSelect,
                }}
            />
        </ErrorBoundary>
    )
}
