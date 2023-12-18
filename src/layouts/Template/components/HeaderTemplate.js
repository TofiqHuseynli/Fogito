import React from "react";
import { ErrorBoundary, InputLazy, Lang, Header, Table } from "fogito-core-ui";
import { Link } from "react-router-dom";
import { historyPushByName } from "@actions";

export const HeaderTemplate = ({
  state,
  setState,
  loadData,
  onDelete,
  path,
  name,
  VIEW
}) => {
  const columns = [
    { name: Lang.get("Owner") },
    { name: Lang.get("Title") },
    { name: Lang.get("Create Date") },
    { name: Lang.get("Actions") },
  ];

  return (
    <ErrorBoundary>
      <Header>
        <div className="row">
          {!!state.selectedIDs.length && (
            <div className="col col-md-auto mt-md-0 mt-3">
              <button
                data-filter-count={state.selectedIDs?.length}
                className="btn btn-danger btn-block position-relative"
                onClick={onDelete}
              >
                <i className="feather feather-trash mr-0" />
              </button>
            </div>
          )}
          {!state.selectedIDs.length && (
            <div className="col col-md-auto mt-md-0 mt-3">
              <button
                className="btn btn-block btn-white"
                onClick={() => loadData()}
              >
                <i className="feather feather-refresh-ccw text-primary" />
              </button>
            </div>
          )}
          {/* Title Serach */}
          <div className="col-lg-5 col-md-3 col-12 mt-md-0 mt-3 order-md-2 order-3">
            <div className="input-group input-group-alternative">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <i className="feather feather-search" />
                </span>
              </div>
              <InputLazy
                defaultValue={state.title}
                action={(title) => setState({ title })}
                onChange={(e) => {
                  {
                    setState({ title: e.target.value });
                    if (e.target.value?.length) {
                      historyPushByName(
                        {
                          label: "title",
                          value: e.target.value,
                        },
                        name
                      );
                    } else {
                      historyPushByName(
                        {
                          label: "title",
                          value: "",
                        },
                        name
                      );
                    }
                  }
                }}
                className="form-control form-control-alternative"
                placeholder={Lang.get("Title")}
              />
            </div>
          </div>

          <div className="col-md-auto col-6 mt-md-0 mt-3 order-md-2 order-4 ml-md-auto">
            <Table.ColumnFilter
              className="btn btn-block btn-white"
              columns={{
                all: columns,
                hidden: state.hiddenColumns,
                required: 1,
                view: VIEW
              }}
              setColumns={(hiddenColumns) => setState({ hiddenColumns })}
            >
              <i className="feather feather-sliders mr-2" />
              {Lang.get("Columns")}
            </Table.ColumnFilter>
          </div>

          <div className="col-md-auto col mt-md-0 mt-3 order-md-4 order-2">
            <Link to={`${path}/add`} className="btn btn-primary btn-block">
              <i className="feather feather-plus" />
            </Link>
          </div>
        </div>
      </Header>
    </ErrorBoundary>
  );
};
