import React from "react";
import {
    ErrorBoundary,
    Lang,
    useToast,
    Popup,
} from "fogito-core-ui";
import {Spinner} from "@components";
import {workspacesCreate} from "@actions";

export const Add = React.memo(({onClose, reload}) => {
    const toast = useToast();

    const [state, setState] = React.useReducer(
        (prevState, newState) => ({...prevState, ...newState}),
        {
            saveLoading: false,
            title: "",
        }
    );


    const onSubmit = async () => {
        setState({saveLoading: true});
        if (!state.saveLoading) {

            let response = await workspacesCreate({
                title: state.title
            });

            if (response) {
                setState({saveLoading: false});
                toast.fire({
                    icon: response.status,
                    title: response.description,
                });
                if (response.status === "success") {
                    await reload();
                    onClose();
                }
            }
        }
    };


    const renderModalHeader = () => (
        <div className="d-flex justify-content-between align-items-center w-100">
            <div>
                <button
                    onClick={() => onClose()}
                    className="btn btn-primary btn-block"
                >
                    <i className="feather feather-chevron-left"/>
                </button>
            </div>
            <h5 className="title fs-16">{Lang.get('Add')}</h5>
            <div>
                <button onClick={onSubmit} className="btn btn-primary px-4">
                    {state.saveLoading ? (<Spinner color="#fff" style={{width: 30}}/>) : (Lang.get("Save"))}
                </button>
            </div>
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
                <div className="form-group">
                    <label className="form-control-label required">
                        {Lang.get("Title")}
                    </label>
                    <input
                        className="form-control w-100"
                        placeholder={Lang.get("Title")}
                        value={state.title}
                        onChange={(e) => setState({title: e.target.value})}
                    />
                    <span className="text-muted fs-12 mt-1">
                            {Lang.get("MaxLength").replace("{length}", 300 - state.title?.length)}
                    </span>
                </div>
            </Popup>
        </ErrorBoundary>
    );
});
