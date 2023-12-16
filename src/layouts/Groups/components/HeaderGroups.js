import React from "react";
import { ErrorBoundary, InputLazy, Lang, Header, Table } from "fogito-core-ui";
import { Link } from "react-router-dom";


export const HeaderGroups = ({ state, setState, loadData, onDelete, path })=>{

    const columns = [
        {name: Lang.get("Title")},
        {name: Lang.get("Customer Count")},
        {name: Lang.get("Create Date")},
        {name: Lang.get("Actions")}
    ];


    return(
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

                    <div className="col-lg-5 col-md-3 col-12 mt-md-0 mt-3 order-md-2 order-3">
                        <div className="input-group input-group-alternative">
                            <div className="input-group-prepend">
                                <span className="input-group-text">
                                    <i className="feather feather-search" />
                                </span>
                            </div>
                            <InputLazy
                                defaultValue={state.title}
                                onChange={() =>{}}
                                action={(title) => setState({title})}
                                className="form-control form-control-alternative"
                                placeholder={Lang.get("Title")}
                            />
                        </div>
                    </div>

                  

                    <div className="col-md-auto col-6 mt-md-0 mt-3 order-md-2 order-4 ml-md-auto">
                        <Table.ColumnFilter
                        className="btn btn-block btn-white"
                        columns={{all: columns, hidden:state.hiddenColumns}}
                        setColumns={(hiddenColumns)=>setState({hiddenColumns})}>
                            <i className="feather feather-sliders mr-2" />
                            {Lang.get("Columns")}
                        </Table.ColumnFilter>
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