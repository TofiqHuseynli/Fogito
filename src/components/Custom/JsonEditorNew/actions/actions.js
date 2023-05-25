import React from "react";

export const getValueByType = (type) =>{
    switch (type) {
        case 'array':
            return []
        case 'object':
            return []
        case 'bool':
            return 'true';
        case 'int':
        case 'float':
            return 0;
        default:
            return ''
    }
}


export const renderTypeValue = (item) => {
    if (item.type === 'object') {
        return '{';
    } else if (item.type === 'array') {
        return '[';
    } else if (item.value.length === 0) {
        return (<span className="text-danger">null</span>);
    } else {
        return item.value.toString();
    }
}

export const isListType = (type) =>{
    return ['array', 'object'].includes(type)
}



