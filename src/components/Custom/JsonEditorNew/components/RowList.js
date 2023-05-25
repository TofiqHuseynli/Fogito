import React from "react";
import {ErrorBoundary} from "fogito-core-ui";
import {RowItem} from "./RowItem";
import {getValueByType} from "../actions/actions";

export const RowList = React.memo(({parentType,params,deepLength,forceUpdate}) => {

    const onDelete = (index) =>{
        params.splice(index,1)
        forceUpdate()
    }

    const onAdd = (list,index,newItem,itemType) =>{

        let disableKey = itemType === 'array' || parentType === 'array'

        if (!disableKey && !newItem.key)
            return 'error';
        if (!newItem.type)
            return 'error';

        newItem.value = getValueByType(newItem.type)
        list.splice(index, 0, newItem);
        forceUpdate()
    }

    return (
        <ErrorBoundary>
            <ul className={`editor-row-list`}>
                {params?.length > 0 && params.map((item,key) => {

                    return (
                        <RowItem
                            key={key+'_'+deepLength}
                            parentType={parentType}
                            item={item}
                            index={key}
                            onAdd={(index,newItem,endItem = false)=>{
                                let listType = ['array', 'object'].includes(item.type)

                                let currentParams = params;
                                let currentIndex = index + 1;

                                if (listType && !endItem){
                                    currentParams = item.value;
                                    currentIndex = 0;
                                }

                                onAdd(currentParams,currentIndex,newItem,item.type)
                            }}
                            onDelete={onDelete}
                            deepLength={deepLength}
                            forceUpdate={forceUpdate}
                        />
                    )
                })}
            </ul>
        </ErrorBoundary>
    );
});
