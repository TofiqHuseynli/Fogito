import React from "react";
import {Spinner} from "@components";
import {groupsInfo, groupsUpdate} from "@actions";
import {
    Popup,
    ErrorBoundary,
    useToast,
    Lang
} from "fogito-core-ui";
import {useParams} from "react-router-dom";
import {Tab, TabPanel, Tabs} from "@components";

export const Info = ({onClose, reload}) => {

    const toast = useToast();

    let urlParams = useParams();

    const [state, setState] = React.useReducer(
        (prevState, newState) => ({...prevState, ...newState}),
        {
            loading: false,
            showPassword: false,
            saveLoading: false,
            roles: [],
            params: {
                id: urlParams?.id,
                title: '',
                note: '',
            }
        }
    );

    const setParams = (data) => {
        setState({params: {...state.params, ...data}})
    }


    const loadData = async () => {
        setState({loading: true})

        let response = await groupsInfo({id: state.params.id});

        if (response) {
            if (response.status === "success" && response.data) {
                setParams(response.data);
            }
            setState({loading: false})
        }
    };


    React.useEffect(() => {
        loadData()

    }, []);
    const renderModalHeader = () => (
        <div className="d-flex justify-content-between align-items-center w-100">
            <h5 className="modal-title">Info</h5>
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
                    <label className="form-control-label ">
                        {Lang.get("Title")}
                    </label>
                    <input
                        className="form-control w-100"
                        placeholder={Lang.get("Write title")}
                        maxLength={30}
                        defaultValue={state.params.title}
                    />
                    <span className="text-muted fs-12 mt-1">
                        {
                            state.params.title.length > 0 ? Lang.get("Avalable length ") + (30 - state.params.title.length) : Lang.get("Max. length ") + (30 - state.params.title.length)}
                    </span>
                    <br />

                    <label className="form-control-label  mt-4">
                        {Lang.get("Note")}
                    </label>
                    <textarea
                        className="form-control w-100 "
                        placeholder={Lang.get("Write note")}
                        rows={6}
                        defaultValue={state.params.note}
                    />

                </div>

                <div className="d-flex justify-content-center align-items-center w-100">
                    <button onClick={onClose} className="btn form-control  w-100">
                        {(Lang.get("Close"))}
                    </button>

                </div>
            </Popup>
        </ErrorBoundary>
    )
}