import React from "react";
import classNames from "classnames";
import { createPortal } from "react-dom";
import { SidebarContext } from "@contexts";

export const Modal = React.forwardRef(
    ({ className, children, show, ...props }, ref) => {
        if (!show) {
            return null;
        } else {
            const { mode } = React.useContext(SidebarContext);
            const [visible, setVisible] = React.useState(false);
            const timeout = React.useRef(null);

            React.useEffect(() => {
                timeout.current = setTimeout(() => {
                    setVisible(show);
                }, 10);

                return () => clearTimeout(timeout.current);
            }, [show]);

            return createPortal(
                <div
                    ref={ref}
                    className={classNames("frame__modal", className, {
                        "sidebar-opened": mode === "opened",
                        "sidebar-closed": mode === "closed",
                        show: visible,
                    })}
                    {...props}
                >
                    {children}
                </div>,
                document.body
            );
        }
    }
);

Modal.Header = React.forwardRef(
    ({ className, children, onClose = () => true, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={classNames(
                    "frame__modal-header d-flex align-items-center",
                    className
                )}
                {...props}
            >
                <button
                    type="button"
                    className="frame__modal-header-close"
                    onClick={onClose}
                >
                    <i className="feather feather-chevron-left" />
                </button>
                <div className="frame__modal-header-content d-flex align-items-center ml-3">
                    {children}
                </div>
            </div>
        );
    }
);

Modal.Body = React.forwardRef(({ className, children, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={classNames("frame__modal-body px-md-3 px-2", className)}
            {...props}
        >
            {children}
        </div>
    );
});

let timeout = null;
export const Popup = ({
                          show = false,
                          title = "",
                          size = "sm",
                          onClose = () => console.log("No action passed!"),
                          children,
                      }) => {
    if (!show) return null;

    const [visible, setVisible] = React.useState(false);

    React.useEffect(() => {
        timeout = setTimeout(() => {
            setVisible(show);
        }, 10);
        return () => clearTimeout(timeout);
    }, [show]);

    return createPortal(
        <div className="frame__popup-backdrop" onClick={onClose}>
            <div
                className={classNames(
                    "content position-relative rounded bg-white mx-auto my-md-5 my-2 px-0 col-11",
                    {
                        show: visible,
                        "col-lg-9 col-md-10 col-sm-11": size === "lg",
                        "col-lg-6 col-md-7 col-sm-8": size === "md",
                        "col-lg-4 col-md-5 col-sm-6": size === "sm",
                    }
                )}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="head rounded-top">
                    <h4 className="title mb-0">{title}</h4>
                </div>
                <div className="body rounded-bottom">{children}</div>
            </div>
        </div>,
        document.body
    );
};
