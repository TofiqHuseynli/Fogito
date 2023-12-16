import React from "react";
import {Spinner} from "@components";
import {groupsInfo, groupsUpdate} from "@actions";
import {
    Popup,
    ErrorBoundary,
    Loading,
    useToast,
    Lang
} from "fogito-core-ui";
import {useParams} from "react-router-dom";
import {Tab, TabPanel, Tabs} from "@components";

export const Edit = ({onClose, reload}) => {

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

    const onSubmit = async (data) => {
        setState({saveLoading: true});
        if (!state.saveLoading) {

            let response = await groupsUpdate(state.params);

            if (response) {
                setState({saveLoading: false});
                if (response.status === "success") {
                    toast.fire({
                        icon: response.status,
                        title: response.description,
                    });
                    await reload();
                    onClose();
                }
            }
        }
    };


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
            <h5 className="modal-title">Edit</h5>
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
                        maxLength={30}
                        value={state.params.title}
                        onChange={(e) => setParams({title: e.target.value})}
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
                        value={state.params.note}
                        onChange={(e) => setParams({note: e.target.value})}
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