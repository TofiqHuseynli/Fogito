import React from "react";
import classNames from "classnames";
import Tooltip from "antd/lib/tooltip";
import { Link } from "react-router-dom";
import {ErrorBoundary, Header, Loading, Popup, Table} from "@components";
import { useModal, useToast } from "@hooks";
import { AppContext } from "@contexts";
import { App, Lang } from "@plugins";
import { inArray } from "@lib";
import { projectsDelete, projectsList } from "@actions";
import { Add, Edit } from "./components";
import { ProjectUsers } from "./forms";

export const Projects = ({ name, match: { path }, type }) => {

    const modal = useModal();
    const toast = useToast();

    const { setActiveRoute } = React.useContext(AppContext);

    const [selectedIDs, setSelectedIDs] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [data, setData] = React.useState([]);
    const [limit, setLimit] = React.useState(10);
    const [count, setCount] = React.useState(0);
    const [skip, setSkip] = React.useState(0);
    const [sort, setSort] = React.useState({
            field: "created_at",
            order: "desc",
    });

    const loadData = async (params) => {
        setLoading(true);
        setSkip(params?.skip || 0);
        let requestParams = {
            limit,
            sort,
            skip: params?.skip || 0,
        };
        let response = await projectsList(requestParams);
        if (response) {
            setLoading(false);
            if (response.status === "success") {
                setData(response.data);
                setCount(response.count);
            } else {
                setData([]);
                setCount(0);
            }
        }
    };



    const onDelete = (array) => {
        if (selectedIDs.length > 0)
            toast
                .fire({
                    position: "center",
                    toast: false,
                    timer: null,
                    title: Lang.get("DeleteAlertTitle"),
                    text: Lang.get("DeleteAlertDescription"),
                    buttonsStyling: false,
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonClass: "btn btn-success",
                    cancelButtonClass: "btn btn-secondary",
                    confirmButtonText: Lang.get("Confirm"),
                    cancelButtonText: Lang.get("Cancel"),
                })
                .then((res) => {
                    if (res?.value) {
                        let count = 1;
                        let total = array.length;
                        array.forEach(async (id) => {
                            setLoading(true);
                            let response = await projectsDelete({id});
                            if (response?.status === "success") {
                                if (count >= total) {
                                    setLoading(false);
                                    setSelectedIDs([]);
                                    toast.fire({
                                        title: response.description,
                                        icon: "success",
                                    });
                                    loadData();
                                }
                                count++;
                            } else {
                                setLoading(false);
                                toast.fire({
                                    title: response.description,
                                    icon: "error",
                                });
                            }
                        });
                    }
                });
    }

    const oneProjectDelete = async (id) => {
        let response = await projectsDelete({id})
        if(response.status === 'success') {
            loadData()
        }
    }

    React.useEffect(() => {
        loadData();
    }, [limit, sort]);

    React.useEffect(() => {
        window.scrollTo(0, 0);
        setActiveRoute({ name, path });
        return () => {
            setActiveRoute({ name: null, path: null });
        };
    }, []);

    //Table options
    const columns = [
        {
            width: 700,
            key: "actions",
            name: Lang.get("Title"),
            sort: 'created_at',
            render: (data) => (
                <Link
                    to={`docs/${data?.id}`}
                    className='table-line'
                    style={{wordBreak: 'break-all', whiteSpace: 'pre-wrap', padding: '20px 10px'}}
                >
                    <div className="table-line-title">{data.title}</div>
                </Link>
            ),
        },
        {
            key: "members",
            name: Lang.get("Users"),
            render: (data) =>
                data?.count > 0 ? (
                    <div className="d-flex">
                        {data.data?.map((item, key) => key < 3 && (
                            <Tooltip title={item.fullname} key={key}>
                                <img
                                    alt="avatar"
                                    src={item.avatar}
                                    width="35"
                                    height="35"
                                    className={classNames("rounded-circle cr-pointer", {
                                        "ml-2": key !== 0,
                                    })}
                                />
                            </Tooltip>
                        ))}
                        {data.count > 3 && (
                            <ProjectUsers item={data.data}>
                                <div
                                    className="cr-pointer rounded-circle bg-primary text-white d-flex align-items-center justify-content-center ml-2"
                                    style={{ width: 35, height: 35 }}
                                >{`${data.count - 3}+`}</div>
                            </ProjectUsers>
                        )}
                    </div>
                ) : (
                    <span className="text-muted">{Lang.get("NoUsers")}</span>
                ),
        },
        {
            key: "actions",
            width: 160,
            name: Lang.get("Docs"),
            render: (data) => (
                <Link to={`docs/${data?.id}`}
                      className={'table-line'}
                      style={{wordBreak: 'break-all', whiteSpace: 'pre-wrap', padding: '20px 10px'}}
                >
                    <div className="table-line-title">{data.count ? `${data.count} Docs` : Lang.get("No Docs")}</div>
                </Link>
            ),
        },
        {
            key: "actions",
            name: Lang.get("Status"),
            center: true,
            render: (data) => {
                return (
                    <div className='d-flex justify-content-center' >
                        <span style={{ width:100, fontSize:11 }} className={`badge badge-${getStatus(data.status.label)} m-0 ml-2`} >{data.status.label}</span>
                    </div>
                );
            },
        },
        {
            key: "actions",
            center: true,
            width: 50,
            render: (data) => (
                <div>
                    <button
                        data-toggle="dropdown"
                        className="btn shadow-none bg-transparent feather feather-more-vertical p-0"
                        style={{ fontSize: "1.2rem" }}
                    />
                    <div className="dropdown-menu">
                        <Link to={`${path}/edit/${data?.id}/${data?.title?.substring(0, 20)}`} className="dropdown-item">
                            {Lang.get("Edit")}
                        </Link>
                        <Link to={`docs/${data?.id}`} className="dropdown-item">
                            {Lang.get("Docs")}
                        </Link>
                        <button
                            className="dropdown-item text-danger"
                            onClick={() => App.deleteModal( ()=>oneProjectDelete(data.id))}
                        >
                            {Lang.get("Delete")}
                        </button>
                    </div>
                </div>
            ),
        },
    ];

    const getStatus = (color) => {
        switch (color) {
            case 'Closed': return 'danger';
            case 'Active': return 'success';
            case 'InProgress': return 'warning';
        }
    }

    const sortable = {
        sort: sort.field,
        sortType: sort.order,
        onSort: (data) => setSort(data),
    };

    const pagination = {
        count,
        limit,
        skip,
        paginationItemLimit: 5,
        limitArray: [5, 10, 50, 100],
        onTake: (take) => setLimit(take),
        onPaginate: (data) => loadData({ skip: data * limit }),
    };

    const select = {
        selectable: true,
        selectedIDs,
        onSelect: (id) => {
            if (inArray(id, selectedIDs)) {
                setSelectedIDs(selectedIDs.filter((item) => item !== id));
            } else {
                setSelectedIDs(selectedIDs.concat([id]));
            }
        },
        onSelectAll: () => {
            if (selectedIDs.length) {
                setSelectedIDs([]);
            } else {
                setSelectedIDs(data.map((item) => item.id));
            }
        },
    };


    return (
        <ErrorBoundary>
            {/*** Modals ***/}
            <Popup
                show={inArray("add", modal.modals)}
                title={Lang.get("AddProject")}
                onClose={() => modal.hide("add")}
            >
                <Add
                    {...{ type }}
                    refresh={() => loadData()}
                    onClose={() => modal.hide("add")}
                />
            </Popup>

            {/*** Header ***/}
            <Header>
                <div className="col d-flex justify-content-between align-items-center px-0">
                    <div className="col-md-1 pl-0">
                        <button
                            className="btn btn-danger btn-block lh-24 "
                            onClick={() => onDelete(selectedIDs)}
                            style={{ opacity: selectedIDs.length > 0 ? 1 : .7 }}
                        >
                            <i className="feather feather-trash-2 fs-18 align-middle" />
                        </button>
                    </div>

                    <h3 className='text-primary' >{Lang.get(name)}</h3>

                    <div className="col-md-1 pr-0">
                        <button
                            className="btn btn-primary btn-block lh-24 px-3"
                            onClick={() => modal.show("add")}
                        >
                            <i className="feather feather-plus fs-18 align-middle" />
                        </button>
                    </div>
                </div>
            </Header>

            {/*** Content ***/}
            <section className="container-fluid position-relative px-md-3 px-2 pb-1">
                <div className="card p-3">
                    {loading && <Loading />}
                    <Table {...{ data, columns, pagination, select, sortable }} />
                </div>
            </section>
        </ErrorBoundary>
    );
};