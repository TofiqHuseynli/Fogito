import React from "react";
import {ErrorBoundary} from "fogito-core-ui";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import classNames from "classnames";



export const MyComp = ({ param, setParam }) => {


    const getValue = (item) => {
        switch (item.type) {
            case 'array':
                return <MyComp param={item.value} />
            case 'object':
                return <MyComp param={item.value} />
            default:
                // return item.value
        }
    }


    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };


    function onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const items = reorder(
            param,
            result.source.index,
            result.destination.index
        );

        setParam({...items})
    }

    return(
        <ErrorBoundary>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {param.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.key+'_'+index} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            {item.key}
                                            {getValue(item)}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            {/*<div className='my-comp' >*/}
            {/*    {param.length && param.map((item,i) =>*/}
            {/*        <div className='d-flex flex-column ' >*/}
            {/*            <div key={i} className='line_' >*/}
            {/*                {item.key} ({item.type}): {(((item.type !== 'array') && (item.type !== 'object')) && item.value)}*/}
            {/*            </div>*/}

            {/*            {getValue(item)}*/}
            {/*        </div>*/}
            {/*    )}*/}
            {/*</div>*/}
        </ErrorBoundary>
    )
}