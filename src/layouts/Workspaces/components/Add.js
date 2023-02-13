import React from "react";
import { ErrorBoundary,Lang, useToast, Popup, Textarea } from "fogito-core-ui";
import { workspacesCreate } from "@actions";

export const Add = ({ refresh, onClose }) => {
  const toast = useToast();
  const [title, setTitle] = React.useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    let response = await workspacesCreate({ data: { title: title } });
    if (response.status === "success") {
      toast.fire({
        title: response.description,
        icon: "success",
      });
      refresh();
      onClose();
    } else {
      toast.fire({
        title: response.description,
        icon: "error",
      });
    }
  };

  return (
    <ErrorBoundary>
      <Popup
        show
        title={Lang.get("AddProject")}
        onClose={() => onClose()}
        header={
          <div className="d-flex justify-content-between align-items-center w-100">
            <div>
              <button onClick={() => onClose()} className="btn btn-primary">
                <i className="feather feather-chevron-left" />
              </button>
            </div>
            <h5 className="title fs-16">{Lang.get("Add")}</h5>
            <div>
              <button
                form="add-form"
                onClick={onSubmit}
                className="btn btn-primary px-4 btn-block"
              >
                {Lang.get("Save")}
              </button>
            </div>
          </div>
        }
      >
        <div className="row">
          <div className="col-md-12">
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <div className="form-group">
                  <label className="form-control-labell">
                    {Lang.get("Title")}
                  </label>
                  <Textarea
                    rows="1"
                    maxLength="300"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={Lang.get("Title")}
                    className="form-control"
                  />
                  <span className="text-muted fs-12 mt-1">
                    {Lang.get("MaxLength")}
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Popup>
    </ErrorBoundary>
  );
};
