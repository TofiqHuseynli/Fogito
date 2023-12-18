import React from "react";
import { ErrorBoundary, InputLazy, Lang, Header, Table } from "fogito-core-ui";
import { getFilterToLocal, usersSearch } from "@actions";
import AsyncSelect from "react-select/async";
import { historyPushByName } from "@actions";
import Auth from "fogito-core-ui/build/library/Auth";
import App from "fogito-core-ui/build/library/App";

export const HeaderHistory = ({
  state,
  setState,
  loadData,
  onDelete,
  name,
  onClearFilters,
  filters,
  VIEW,
}) => {
  const USER = App.get("USER");
  const columns = [
    { name: Lang.get("Receiver") },
    { name: Lang.get("Template") },
    { name: Lang.get("E-mail") },
    { name: Lang.get("From") },
    { name: Lang.get("Type-") },
    { name: Lang.get("Information") },
    { name: Lang.get("Send Date") },
    { name: Lang.get("Actions") },
  ];

  const loadUsers = async (query) => {
    let response = await usersSearch({
      skip: 0,
      limit: 20,
      query,
      type: "members",
      selected_id: getFilterToLocal(name, "member") || "",
    });
    if (response?.status === "success") {
      if (response.selected_id) {
        setState({ member: response.selected_id });
      }
      return response.data?.map((item) => ({
        value: item.id,
        label: item.fullname,
      }));
    }
  };

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

          {/* Member */}
          <div className="col-md-3 col-6 mt-md-0 mt-3 order-md-2 order-2 ">
            <div className="input-group input-group-alternative">
              <div className="input-group-prepend">
                <div
                  className="input-group-text border__right cursor-pointer"
                  onClick={() => {
                    if (!USER) {
                      setState({
                        member: !state.member
                          ? {
                              label: Auth.get("fullname"),
                              value: Auth.get("id"),
                            }
                          : null,
                      });
                      historyPushByName(
                        {
                          label: "member",
                          value: !state.member ? Auth.get("id") : "",
                        },
                        name
                      );
                    }
                  }}
                >
                  <i
                    className={`feather feather-${
                      !!state.member ? "user" : "users"
                    } text-primary`}
                  />
                </div>
              </div>
              <AsyncSelect
                isClearable
                cacheOptions
                defaultOptions
                value={state.member}
                loadOptions={loadUsers}
                placeholder={Lang.get("All")}
                onChange={(member) => {
                  setState({
                    member: member,
                  });
                  historyPushByName(
                    {
                      label: "member",
                      value: member?.value || "",
                    },
                    name
                  );
                }}
                className="form-control form-control-alternative"
              />
            </div>
          </div>
          
          {/* Title Serach */}
          <div className="col-lg-4 col-md-3 col-12 mt-md-0 mt-3 order-md-2 order-2">
            <div className="input-group input-group-alternative">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <i className="feather feather-search" />
                </span>
              </div>
              <InputLazy
                defaultValue={state.title}
                onChange={(e) => {
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
                  }}
                action={(e) => setState({ title: e.target.value })}
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
                view: VIEW,
              }}
              setColumns={(hiddenColumns) => setState({ hiddenColumns })}
            >
              <i className="feather feather-sliders mr-2" />
              {Lang.get("Columns")}
            </Table.ColumnFilter>
          </div>

          <div className="col-6 col-md-auto mt-md-0 mt-3 order-md-3 order-3">
            <Header.FilterButton
              onClick={() => setState({ filter: true })}
              containerClassName="h-100 w-100"
              onClear={onClearFilters}
              className="btn btn-white"
              count={Object.keys(filters).filter((key) => filters[key]).length}
            >
              <i className="feather feather-filter mr-2" />
              {Lang.get("Filters")}
            </Header.FilterButton>
          </div>
        </div>
      </Header>
    </ErrorBoundary>
  );
};
