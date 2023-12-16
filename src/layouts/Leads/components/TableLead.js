import React from "react";
import { ErrorBoundary, Lang, Table, SimpleDate, useModal, useToast, Api, Filters } from "fogito-core-ui";
import { Link } from "react-router-dom";
import { App } from "@plugins";
import { listDelete, leadArchive, groupsMinList } from "@actions";
import { ModalShowGroups } from "./ModalShowGroups";




export const TableLead = ({ state, setState, path, loadData, VIEW }) => {

    const modal = useModal();
    const toast = useToast();
    const columns = [
        {
            name: Lang.get("RECEIVER"),
            width: 50,
            render: (data) => (
                <div className="user__content">
                    <Link className='text-primary-alternative' to={`${path}/edit/${data.id}`} >{data.receiver}</Link>

                </div>),
        },
        {
            name: Lang.get("E-MAIL"),
            render: (data) => (
                <div className="user__content">
                    <Link className='text-primary-alternative' to={`${path}/edit/${data.id}`} >{data.email}</Link>

                </div>),
        },


        {
            name: Lang.get("GROUP"),
            render: (data) => (
                <div className="d-flex align-items-center">
                    {data.group.length > 2 ?
                        <div className="d-flex align-items-center">
                            <span className="mx-1 mb-2 badge table-items fs-12 badge-success">{data.group[0]}</span>
                            <span className="mx-1 mb-2 badge table-items fs-12 badge-success">{data.group[1]}</span>
                            <span className="mx-1 mb-2 badge table-items fs-12 badge-success cursor-pointer" onClick={() => {
                                modal.show("groups");
                            }}>+{data.group.length - 2}</span>
                        </div> :
                        data.group.map((item) => (
                            <span className="mx-1 mb-2 badge table-items fs-12 badge-success">{item}</span>

                        ))}
                </div>)

        },
        {
            name: Lang.get("TYPE"),
            key: 'type'


        },
        {
            name: Lang.get("STATUS"),
            render: (data) => (
                <div className="user__content">
                    <Link className='text-primary-alternative' to={`kanban`} >{data.status}</Link>

                </div>),


        },
        {
            name: Lang.get("CREATE DATE"),
            width: 50,
            center: true,
            sort: "created_at",
            render: (data) => <SimpleDate date={data?.send_date} />,
        },
        {
            name: Lang.get("ACTIONS"),
            width: 50,
            center: true,
            render: (data) => (
                <div className="d-flex">
                    <Link style={{ borderRadius: "50%" }}
                        className="btn btn-outline-warning btn-sm h-auto lh-10 p-1 mb-2 mb-lg-0 mr-0 mx-2"
                        to={`${path}/edit/${data.id}`}><i className="feather feather-edit-2"></i></Link>

                    <button className="btn btn-outline-primary feather feather-archive btn-sm h-auto lh-10 p-1 mb-2 mb-lg-0 mr-1 "
                        style={{ borderRadius: "50%" }}
                        onClick={() => App.deleteModal(() => onArchive(data.id))} />

                    <button className="btn btn-outline-danger feather feather-x
                       btn btn-outline-danger btn-sm h-auto lh-10 p-1 mb-2 mb-lg-0 mr-0 mx-1"
                        style={{ borderRadius: "50%" }}
                        onClick={() => App.deleteModal(() => onDelete(data.id))} />

                </div>
            ),
        },
    ];
    const onDelete = async (id) => {
        let response = await listDelete({ id });
        toast.fire({
            title: response.description,
            icon: response.status
        });
        if (response.status === "success") {
            loadData();
        }
    };

    const onArchive = async (id) => {
        let response = await leadArchive({ id, archived: 1 });
        toast.fire({
            title: response.description,
            icon: response.status
        });
        if (response.status === "success") {
            loadData();
        }
    };

    const onSelect = (id) => {
        if (state.selectedIDs.includes(id)) {
            setState({ selectedIDs: state.selectedIDs.filter((item) => item !== id), });
        } else {
            setState({ selectedIDs: state.selectedIDs.concat([id]) });
        }
    }

    const onSelectAll = () => {
        if (state.data.every((item) => state.selectedIDs.includes(item.id))) {
            setState({ selectedIDs: [] });
        } else {
            setState({ selectedIDs: state.data.map((item) => item.id) });
        }
    };

    
    return (
        <ErrorBoundary>
            {modal.modals.includes("groups") && (
                <ModalShowGroups
                    state={state}
                    reloadTable={loadData}
                    onClose={() => modal.hide("groups")}
                />
            )}

            <Table
                view={VIEW}
                data={state.data}
                loading={state.loading}
                columns={{ all: columns, hidden: state.hiddenColumns }}
                pagination={{
                    skip: state.skip,
                    limit: state.limit,
                    count: state.count,
                    onTake: (limit) => setState({ limit }),
                    onPaginate: (page) => loadData({ skip: page * state.limit }),
                }}

                select={{
                    selectedIDs: state.selectedIDs,
                    onSelect: onSelect,
                    onSelectAll: onSelectAll,
                }}
            />
        </ErrorBoundary>
    )

}