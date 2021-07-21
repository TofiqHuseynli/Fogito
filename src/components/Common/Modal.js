import React from "react";
import classNames from "classnames";
import { createPortal } from "react-dom";

export const Modal = ({ children, show }) => {
    const [visible, setVisible] = React.useState(false);
    const timeout = React.useRef(null);

    React.useEffect(() => {
        if (timeout.current) {
            clearTimeout(timeout.current);
        }
        timeout.current = setTimeout(() => {
            setVisible(show);
        });
    }, [show]);

    if (!show) return null;

    return createPortal(
        <div
            className={classNames("frame-modal", { show: visible })}
        >
            {children}
        </div>,
        document.body
    );
};

Modal.Header = ({ children, onClose = () => false }) => {
    return (
        <div className="frame-modal-header">
            <button type="button" className="close" onClick={onClose}>
                <i className="feather feather-chevron-left" />
            </button>
            {children}
        </div>
    );
};

Modal.Body = ({ children }) => {
    return <div className="frame-modal-body">{children}</div>;
};

export const Popup = ({
                          size = "md",
                          show,
                          title,
                          onClose = () => false,
                          children,
                      }) => {
    const timeout = React.useRef(null);
    const [visible, setVisible] = React.useState(false);

    React.useEffect(() => {
        if (timeout.current) {
            clearTimeout(timeout.current);
        }
        timeout.current = setTimeout(() => {
            setVisible(show);
        });
    }, [show]);

    if (!show) return null;

    return createPortal(
        <div
            role="dialog"
            tabIndex="-1"
            className={classNames("modal fade", { show: visible })}
            onMouseDown={onClose}
        >
            <div
                role="document"
                className={classNames("modal-dialog modal-dialog-centered", {
                    "modal-sm": size === "sm",
                    "modal-md": size === "md",
                    "modal-lg": size === "lg",
                    "modal-xl": size === "xl",
                })}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="close" onClick={onClose}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">{children}</div>
                </div>
            </div>
        </div>,
        document.body
    );
};