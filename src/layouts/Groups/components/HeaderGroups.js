import React from "react";
import { ErrorBoundary, InputLazy, Lang, Header, Table } from "fogito-core-ui";
import { Link } from "react-router-dom";
import moment from "moment";
import { historyPushByName } from "@actions";
import Tooltip from "antd/lib/tooltip";
import DatePicker from "antd/lib/date-picker";

export const HeaderGroups = ({
  state,
  setState,
  loadData,
  onDelete,
  path,
  name,
  VIEW
}) => {
  const columns = [
    { name: Lang.get("Title") },
    { name: Lang.get("Customer Count") },
    { name: Lang.get("Create Date") },
    { name: Lang.get("Actions") },
  ];

  return (
    <ErrorBoundary>
      <Header>
        <div className="row">
          {!!state.selectedIDs.length && (
            <div className="col col-md-auto  mt-md-0 mt-3">
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

          <div className="col-lg-4 col-md-3 col-12 mt-md-0 mt-3 order-md-2 order-3">
            <div className="input-group input-group-alternative">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <i className="feather feather-search" />
                </span>
              </div>
              <InputLazy
                defaultValue={state.title}
                // onChange={(e) =>{setState({title: e.target.value})}}
                action={(e) => {
                  setState({ title: e.target.value });
                }}
                className="form-control form-control-alternative"
                placeholder={Lang.get("Title")}
              />
            </div>
          </div>

          {/* Date */}
          <div className="col-lg-3 col-md-3 col-6 mb-2 mt-3 mt-lg-0 mt-md-0 ml-auto order-4 order-lg-2 order-md-2 ">
            <div className="input-group input-group-alternative">
              <div className="input-group-prepend">
                <Tooltip
                  title={<div className="fw-normal">{Lang.get("Today")}</div>}
                >
                  <div
                    className="input-group-text border__right cursor-pointer"
                    onClick={() => {
                      setState({
                        range: {
                          start: moment().format("YYYY-MM-DD"),
                          end: moment().format("YYYY-MM-DD"),
                        },
                      });
                      historyPushByName(
                        {
                          label: "date",
                          value: `${moment().unix()}T${moment().unix() || ""}`,
                        },
                        name
                      );
                    }}
                  >
                    <i className="feather feather-type text-primary fs-16" />
                  </div>
                </Tooltip>
              </div>
              <DatePicker.RangePicker
                allowEmpty={[true, true]}
                value={[
                  state.range.start
                    ? moment(state.range.start, "YYYY-MM-DD")
                    : "",
                  state.range.end ? moment(state.range.end, "YYYY-MM-DD") : "",
                ]}
                onChange={(date, dateString) => {
                  setState({
                    range: {
                      start: dateString[0],
                      end: dateString[1],
                    },
                  });
                  if (dateString[0] !== "" && dateString[1] !== "") {
                    historyPushByName(
                      {
                        label: "date",
                        value: `${moment(dateString[0]).unix()}T${
                          moment(dateString[1]).unix() || ""
                        }`,
                      },
                      name
                    );
                  } else {
                    historyPushByName(
                      {
                        label: "date",
                        value: "",
                      },
                      name
                    );
                  }
                }}
                placeholder={[Lang.get("StartDate"), Lang.get("EndDate")]}
                className="form-control"
              />
            </div>
          </div>

          <div className="col-md-auto col-6 mt-md-0 mt-3 order-md-2 order-4 md-auto">
            <Table.ColumnFilter
              className="btn btn-block btn-white"
              columns={{
                all: columns,
                hidden: state.hiddenColumns,
                required: 1,
                view: VIEW,
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
