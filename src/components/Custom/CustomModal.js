import React from "react";
import {Modal} from "react-bootstrap";
import {ErrorBoundary} from "@components";

export const CustomModal = ({children, show, title, size, onHide}) => {
    return (
        <ErrorBoundary>
            <Modal show={show} onHide={onHide} size={size} >
                <Modal.Header closeButton >
                    <Modal.Title className='text-primary' >{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {children}
                </Modal.Body>
            </Modal>
        </ErrorBoundary>
    )
}