import React, {useState} from "react";
import {ErrorBoundary} from "fogito-core-ui";
import {NewLine} from "../components";

export const RowItemEnd = ({item,onDelete, onAdd, index,parentType}) => {

    const [showNewLine, setShowNewLine] = useState(false);

    return (
        <ErrorBoundary>
            <li>
                <div className="editor-item" >
                    <div className="editor-item-content">
                        <span className="editor-item-value">
                            {item.type === 'array' && ']'}
                            {item.type === 'object' && '}'}
                        </span>
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
                        disableKey={parentType === 'array'}
                        setShowNewLine={setShowNewLine}
                        onAdd={(newItem)=>onAdd(index,newItem,true)}
                    />
                )}
            </li>

        </ErrorBoundary>
    )
};

