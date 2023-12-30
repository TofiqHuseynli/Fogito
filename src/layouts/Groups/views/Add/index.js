import React from "react";
import {
    ErrorBoundary,
    Lang,
    useToast,
    Popup,
} from "fogito-core-ui";
import { Spinner } from "@components";
import { groupsCreate } from "@actions";

export const Add = ({ onClose, reload }) => {

    const toast = useToast();

    const [state, setState] = React.useReducer(
        (prevState, newState) => ({ ...prevState, ...newState }),
        {
            saveLoading: false,
            title: "",
            note: ""
        }
    );

    const onSubmit = async () => {
        setState({ saveLoading: true });
        if (!state.saveLoading) {
            let response = await groupsCreate({
                title: state.title,
                note:state.note
            });
            if (response) {
                setState({ saveLoading: false });
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
                <div className="form-group">
                    <label className="form-control-label required">
                        {Lang.get("Title")}
                    </label>
                    <input
                        className="form-control w-100"
                        placeholder={Lang.get("Write title")}
                        value={state.title}
                        maxLength={30}
                        onChange={(e) => setState({ title: e.target.value })}
                    />
                    <span className="text-muted fs-12 mt-1">
                        {
                            state.title.length > 0 ? Lang.get("Avalable length ") + (30 - state.title?.length) : Lang.get("Max. length ") + (30 - state.title?.length)}
                    </span>
                    <br />
                    <label className="form-control-label  mt-4">
                        {Lang.get("Note")}
                    </label>
                    <textarea
                        className="form-control w-100 "
                        placeholder={Lang.get("Write note")}
                        value={state.note}
                        rows={6}
                        onChange={(e) => setState({ note: e.target.value })}
                    />
                </div>

                <div className="d-flex justify-content-between align-items-center w-100">

                    <button onClick={onSubmit} className="btn btn-primary w-50 d-flex justify-content-center align-items-center ">
                        {state.saveLoading ? (<Spinner color="#fff" style={{ width: 30 }} />) : (Lang.get("Save"))}
                    </button>

                    <button onClick={onClose} className="btn btn-light w-50 ml-4">
                        {(Lang.get("Close"))}
                    </button>

                </div>
            </Popup>
        </ErrorBoundary>
    )
}