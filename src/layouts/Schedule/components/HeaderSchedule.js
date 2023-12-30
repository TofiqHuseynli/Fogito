import React from "react";
import { ErrorBoundary, InputLazy, Lang, Header, Auth, Table } from "fogito-core-ui";
import AsyncSelect from "react-select/async";
import { Link } from "react-router-dom";
import { historyPushByName } from "@actions";


export const HeaderSchedule = ({ state, setState, loadData, onDelete,
    path, onClearFilters, VIEW, filters, loadUsers, name }) => {

    
    const columns = [
        { name: Lang.get("Receiver") },
        { name: Lang.get("Lead Groups") },
        { name: Lang.get("Template") },
        { name: Lang.get("E-mail") },
        { name: Lang.get("Create Date") },
        { name: Lang.get("Send Date") },
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

                    {/* member */}
                    <div className='col-md-3 col-6 mt-md-0 mt-3 order-md-2 order-2 md-auto'>
                        <div className='input-group input-group-alternative'>
                            <div className='input-group-prepend'>
                                <div
                                    className='input-group-text border__right cursor-pointer'
                                    onClick={() => {
                                        setState({
                                            consumer: !state.member
                                                ? {
                                                    label: Auth.get("fullname"),
                                                    value: Auth.get("_id"),
                                                }
                                                : null,
                                        });
                                        historyPushByName(
                                            {
                                                label: "member",
                                                value: state.member ? Auth.get("_id") : "",
                                            },
                                            name
                                        );
                                    }}
                                >
                                    <i
                                        className={`feather feather-${!!state.member ? "user" : "users"
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
                                    setState({ member });
                                    historyPushByName(
                                        {
                                            label: "member",
                                            value: member?.value || "",
                                        },
                                        name
                                    );
                                }}
                                className='form-control form-control-alternative'
                            />
                        </div>
                    </div>


                    {/* Email */}
                    <div className=" col-md-3 col-12 mt-md-0 mt-3 order-md-2 order-3">
                        <div className="input-group input-group-alternative">
                            <div className="input-group-prepend">
                                <span className="input-group-text">
                                    <i className="feather feather-search" />
                                </span>
                            </div>
                            <InputLazy
                                defaultValue={state.email}
                                action={(e) => setState({email: e.target.value})}
                                className="form-control form-control-alternative"
                                placeholder={Lang.get("Email")}
                                onChange={(e) => {   {
                                    setState({ email: e.target.value });
                                    if (e.target.value?.length) {
                                      historyPushByName(
                                        {
                                          label: "email",
                                          value: e.target.value,
                                        },
                                        name
                                      );
                                    } else {
                                      historyPushByName(
                                        {
                                          label: "email",
                                          value: "",
                                        },
                                        name
                                      );
                                    }
                                  } }}
                            />
                        </div>
                    </div>



                    <div className="col-md-auto col-6 mt-md-0 mt-3 order-md-2 order-4 ml-md-auto">
                        <Table.ColumnFilter
                            className="btn btn-block btn-white"
                            columns={{ all: columns, hidden: state.hiddenColumns, view: VIEW, }}
                            setColumns={(hiddenColumns) => setState({ hiddenColumns })}>
                            <i className="feather feather-sliders mr-2" />
                            {Lang.get("Columns")}
                        </Table.ColumnFilter>
                    </div>

                    <div className='col-6 col-md-auto mt-md-0 mt-3 order-md-3 order-3'>
                        <Header.FilterButton
                            onClick={() => setState({ filter: true })}
                            containerClassName='h-100 w-100'
                            onClear={onClearFilters}
                            className='btn btn-white'
                            count={Object.keys(filters).filter((key) => filters[key]).length}
                        >
                            <i className='feather feather-filter mr-2' />
                            {Lang.get("Filters")}
                        </Header.FilterButton>
                    </div>



                    <div
                        className="col-md-auto col mt-md-0 mt-3 order-md-4 order-2"
                    >
                        <Link to={`${path}/add`} className="btn btn-success btn-block">
                            <i className="feather feather-plus" />
                        </Link>
                    </div>





                </div>
            </Header>
        </ErrorBoundary>
    )
}