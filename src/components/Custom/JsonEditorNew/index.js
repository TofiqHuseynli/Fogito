import React, {useState} from "react";
import {ErrorBoundary} from "fogito-core-ui";
import {NewLine, RowList} from "./components";

export const JsonEditorNew = ({formParams}) => {

    const [showNewLine, setShowNewLine] = useState(false);
    const [renderCount, setRenderCount] = useState(0)

    const forceUpdate = () => {
        setRenderCount(renderCount + 1)
    }

    const getRowNums = (params, deepth = 0) => {
        let res = deepth === 0 ? 2 : 0;

        params.map(item => {
            if (['object', 'array'].includes(item.type)) {
                res += 2;
                if (item.value.length > 0  && typeof item.value === 'object')
                    res += getRowNums(item.value, deepth + 1);
            } else {
                res += 1;
            }
        })

        return res;
    }


    const onAdd = (item) => {
        if (!item.key || !item.type) {
            return 'error';
        }
        formParams.splice(0, 0, item);
        forceUpdate()
    }


    let totalRowNums = getRowNums(formParams)

    console.log(formParams)


    return (
        <ErrorBoundary>
            <div className="json-editor_container">
                <div className="json-editor_left">
                    {[...Array(totalRowNums)].map((e, i) => (
                        <span className='editor-num'>{i + 1}</span>
                    ))}
                </div>
                <div className="json-editor_right">

                    {/*start of params*/}
                    <div className="editor-item" >
                        <div className="editor-item-content">
                            <span className="editor-item-type text-danger">(object)</span>
                            <span className="editor-item-value"> &#123;</span>
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
                        </div>
                    </div>


                    {showNewLine && (
                        <NewLine
                            setShowNewLine={setShowNewLine}
                            onAdd={onAdd}
                        />
                    )}

                    <RowList
                        forceUpdate={forceUpdate}
                        params={formParams}
                        deepLenght={0}
                    />

                    {/*end of params*/}
                    <div className="editor-item">
                        <div className="editor-item-content">
                            <span className="editor-item-value"> &#125;</span>
                        </div>
                    </div>

                </div>
            </div>
        </ErrorBoundary>
    )
};

