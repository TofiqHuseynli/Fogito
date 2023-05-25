import React from 'react';
import {isListType, renderTypeValue} from "../actions/actions";
import {InputGeneral} from "@components/Custom/JsonEditorNew/components/InputGeneral";

export const ValueInput = ({item,onEdit}) => {


    if (isListType(item.type)){
        return (<span className="editor-item-value"> {renderTypeValue(item)} </span>);
    }else if (item.type === 'bool'){
        return (
            <select
                className='editor-value-select'
                value={item.value}
                onChange={(e)=> onEdit(e.target.value)}
            >
                <option value={'true'}>true</option>
                <option value={'false'}>false</option>
            </select>
        )
    }else{
        return (
            <InputGeneral
                className='editor-item-value'
                defaultValue={renderTypeValue(item)}
                value={item.value}
                onEdit={onEdit}
            />
        )
    }

}
