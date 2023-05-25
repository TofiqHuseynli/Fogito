import React, {useState} from "react";
import {ErrorBoundary} from "fogito-core-ui";
import {getValueByType, isListType, renderTypeValue} from "../actions/actions";
import {RowList, InputGeneral, NewLine, RowItemEnd, TypeInput, ValueInput} from "../components";

export const RowItem = ({parentType,item, deepLength, onDelete, onAdd, index, forceUpdate}) => {

    const onEdit = (key, value) => {
        if (key === 'type' && item['type'] !== value){
            item['value'] = getValueByType(value)
        }

        item[key] = value;

        forceUpdate()
    }

    const [showNewLine, setShowNewLine] = useState(false);

    let listType = isListType(item.type)

    return (
        <ErrorBoundary>
            <li>
                <div className="editor-item">
                    <div className="editor-item-content">

                        <span
                            onClick={() => onEdit('is_required', !item?.is_required)}
                            className={`editor-item-required ${item?.is_required && 'text-danger'}`}
                        >
                            &#10033;
                        </span>

                        {parentType !== 'array' &&
                            <InputGeneral
                                className='editor-item-key'
                                value={item.key}
                                onEdit={(value) => onEdit('key', value)}
                            />
                        }

                        &nbsp;

                        <TypeInput
                            value={item?.type}
                            onEdit={(value) => onEdit('type', value)}
                        />

                        &nbsp;

                        <ValueInput
                            item={item}
                            onEdit={(value) => onEdit('value', value)}
                        />

                        <InputGeneral
                            className={`editor-item-comment ${!item?.comment && 'comment-placeholder'}`}
                            value={item.comment}
                            onEdit={(value) => onEdit('comment', value)}
                        />
                    </div>

                    <div
                        onDoubleClick={() => setShowNewLine(true)}
                        style={{flex:1}}
                    >
                        &nbsp;
                    </div>

                    <div className="editor-icons">
                        <i
                            onClick={() => setShowNewLine(true)}
                            className="feather feather-plus add-icon"
                        />
                        <i
                            onClick={() => onDelete(index)}
                            className="feather feather-trash trash-icon"
                        />
                    </div>
                </div>

                {showNewLine && (
                    <NewLine
                        disableKey={(parentType === 'array' || item.type === 'array') && item.type !== 'object'}
                        setShowNewLine={setShowNewLine}
                        onAdd={(newItem)=>onAdd(index,newItem)}
                    />
                )}


                {(item.value?.length > 0 && listType) && typeof item.value === 'object' && (
                    <RowList
                        parentType={item.type}
                        params={item.value}
                        forceUpdate={forceUpdate}
                        deepLength={deepLength + 1}
                    />
                )}

            </li>

            {listType && (
                <RowItemEnd
                    item={item}
                    index={index}
                    onAdd={onAdd}
                    onDelete={onDelete}
                    parentType={parentType}
                />
            )}
        </ErrorBoundary>
    )
};

