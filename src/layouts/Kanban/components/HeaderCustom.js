import React from "react";
import { ErrorBoundary, InputLazy, Lang, Header, useModal } from "fogito-core-ui";
import { Link } from "react-router-dom";
import Select from "react-select";
import {
    onFilterStorageBySection,
    historyPushByName,
    groupsMinList,
} from "@actions";


export const HeaderCustom = ({ name, state, setState, reload, onDelete, onShow, onClearFilters, filters }) => {

    const modal = useModal();



    // const [params, setParams] = React.useReducer(
    //     (prevState, newState) => ({ ...prevState, ...newState }),
    //     filters
    // );



    const archivedList = [
        { value: '0', label: Lang.get('Active') },
        { value: '1', label: Lang.get('Archived') },
    ]




    return (
        <ErrorBoundary>
            <Header>
                <div className="row">
                    <div className="col col-md-auto mt-md-0 mt-3">
                        <button
                            className="btn btn-block btn-white"
                            onClick={() => reload()}
                        >
                            <i className="feather feather-refresh-ccw text-primary" />
                        </button>
                    </div>


                    <div className="col-lg-4 col-md-3 col-12 mt-md-0 mt-3 order-md-2 order-3">
                        <div className="input-group input-group-alternative">
                            <div className="input-group-prepend">
                                <span className="input-group-text">
                                    <i className="feather feather-search" />
                                </span>
                            </div>
                            <InputLazy
                                autoFocus={true}
                                value={state.fullname}
                                className='form-control form-control-alternative'
                                placeholder={Lang.get("Full Name")}
                                action={(e) => reload({ fullname: e.target.value })}
                                onChange={(e) => {  
                                    setState({ fullname: e.target.value, headerLoading: false });
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
                            />
                        </div>
                    </div>


                    {/*Type*/}
                    <div className='col-lg-3 col-md-4 mt-md-0 mt-3  order-3'>
                        <div className='input-group input-group-alternative'>
                            <Select
                                isClearable
                                cacheOptions
                                defaultOptions
                                components={{
                                    Control: ({ innerProps, children, innerRef }) => {
                                        return (
                                            <div
                                                className='input-group-prepend'
                                                {...innerProps}
                                                ref={innerRef}
                                            >
                                                <label className='input-group-text'>
                                                    {Lang.get("Type")}
                                                </label>
                                                {children}
                                            </div>
                                        );
                                    },
                                }}
                                options={archivedList}
                                value={state.archived?.label
                                    ? state.archived
                                    : archivedList.find((item) => (item.value == state.archived))}
                                placeholder={Lang.get("Select...")}
                                onChange={(type) => {
                                    setState({ archived: type, headerLoading: false  });
                                    historyPushByName(
                                        {
                                            label: "archived",
                                            value: type ? String(type?.value) : false,
                                        },
                                        name
                                    );
                                }}
                                className='form-control form-control-alternative'
                            />
                        </div>
                    </div>

                    <div className='col-6 col-md-auto mt-md-0 mt-3 order-md-3 order-3 ml-md-auto'>
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
                        <button
                            className="btn btn-primary btn-block lh-24 px-3"
                            onClick={onShow}
                        >
                            <i className="feather feather-plus fs-18 align-middle" />
                        </button>
                    </div>

                </div>
            </Header>
        </ErrorBoundary>
    )
}