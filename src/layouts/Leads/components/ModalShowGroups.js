import React, { useEffect, useState } from "react";
import {
    ErrorBoundary,
    useToast,
    Popup,
} from "fogito-core-ui";



export const ModalShowGroups = ({ onClose, state }) => {

    const toast = useToast();




    const renderModalHeader = () => (
        <div className="d-flex justify-content-between align-items-center w-100">
            <h5 className="modal-title">Create</h5>
            <button
                onClick={() => onClose()}
                className="close"><i className="feather feather-x pointer"></i></button>
        </div>
    )

    
    return (
        <ErrorBoundary>
            <Popup
                show
                size="md"
                onClose={onClose}
                header={renderModalHeader()}
            >

                <div className="d-flex flex-column   align-items-start">
                    {state.data.map((item) => (
                        item.group.map((group, key) => (
                            <span className="mr-1 mb-2 badge table-items fs-12 badge-success" key={key}>{group}</span>

                        ))



                    ))}
                </div>




            </Popup>
        </ErrorBoundary>
    )
}