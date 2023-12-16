import React from "react";
import { ErrorBoundary, Lang, Table, SimpleDate, Members, useToast, Api } from "fogito-core-ui";
import { Link } from "react-router-dom";
import { App } from "@plugins";
import { renderStatusColumn } from "@layouts/Workspaces/actions";

import { API_ROUTES } from "@config";
import { groupsDelete, templateDelete } from "@actions";
import { Button } from "antd";

export const TableTemplate = ({ state, setState, path, loadData }) => {

    const toast = useToast()

    const columns = [
        {
            name: Lang.get("OWNER"),
            render: (data) => (
                <div className="user__content">
                    <Link to={{ pathname: `/docs/${data?.owner?.label}` }} >{data?.owner?.label}</Link>

                </div>),
        },
        {
            name: Lang.get("TITLE"),
            width: 200,
            key: 'title',
        },


        {
            name: Lang.get("CREATE DATE"),
            width: 250,
            center: false,
            sort: "created_at",
            render: (data) => <SimpleDate date={data.create_date} />,
        },
        {
            name: Lang.get("ACTIONS"),
            center: true,
            width: 100,
            render: (data) => (
                <div>
                    <Link style={{ borderTopLeftRadius: "0px", borderTopRightRadius: "0px" }}
                        className="btn btn-outline-warning btn-sm h-auto lh-10 p-1 mb-2 mb-lg-0 mr-0 ml-2"
                        to={`${path}/edit/${data.id}`}><i className="feather feather-edit-2"></i></Link>


                    <button className="btn btn-outline-danger feather feather-x
                       btn btn-outline-danger btn-sm h-auto lh-10 p-1 mb-2 mb-lg-0 mr-0 mx-2"
                        style={{ borderRadius: "50%" }}
                        onClick={() => App.deleteModal(() => onDelete(data.id))} />

                </div>
            ),
        },
    ];

    const onDelete = async (id) => {
        let response = await templateDelete({ id });

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
    }


    return (
        <ErrorBoundary>

            <Table
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