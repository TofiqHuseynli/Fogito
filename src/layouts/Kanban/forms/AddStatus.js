import React from "react";
import { ErrorBoundary, Loading, Lang, useToast } from "fogito-core-ui";
import { columnCreate, statusCreate } from "@actions";

export const AddStatus = React.memo(({ id, reload, onClose }) => {
  const toast = useToast();
  const [state, setState] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    {
      loading: false,
      params: {  title: "" },
    }
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    setState({ loading: true });
    let response = await statusCreate(state.params);
    if (response) {
      setState({ loading: false });
      toast.fire({ icon: response.status, title: response.description });
      if (response.status === "success") {
        await reload(response.data);
        onClose();
      }
    }
  };

  return (
    <ErrorBoundary>
      {state.loading && <Loading />}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label className="form-control-label">{Lang.get("Title")}</label>
          <input
            autoFocus
            className="form-control"
            placeholder={Lang.get("Title")}
            value={state.params.title}
            onChange={(e) =>
              setState({ params: { ...state.params, title: e.target.value } })
            }
          />
        </div>
        <div className="form-row">
          <div className="col-6">
            <button className="btn btn-block btn-primary">
              {Lang.get("Submit")}
            </button>
          </div>
          <div className="col-6">
            <button
              type="button"
              className="btn btn-block btn-secondary"
              onClick={onClose}
            >
              {Lang.get("Close")}
            </button>
          </div>
        </div>
      </form>
    </ErrorBoundary>
  );
});
