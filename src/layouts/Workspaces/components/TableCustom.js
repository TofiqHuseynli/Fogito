import React from "react";
import {ErrorBoundary, Lang, Table, SimpleDate, Members, useToast, Api} from "fogito-core-ui";
import {Link} from "react-router-dom";
import {App} from "@plugins";
import {renderStatusColumn} from "@layouts/Workspaces/actions";
import {workspacesDelete} from "@actions";
import {API_ROUTES} from "@config";

export const TableCustom = ({state, setState,path,loadData}) => {
    const toast = useToast()

    const columns = [
        {
            name: Lang.get("Title"),
            render: (data) => (
                <div className="user__content">
                    <Link to={{pathname: `/docs/${data.id}`}} >{data.title}</Link>

                    {/*<Link to={`${path}/edit/${data?.id}?`}>{data.title}</Link>*/}

                    {/*<p*/}
                    {/*    className="text-muted fs-14 mb-0 lh-16"*/}
                    {/*    style={{*/}
                    {/*        textOverflow: "ellipsis",*/}
                    {/*        overflow: "hidden",*/}
                    {/*        whiteSpace: "nowrap",*/}
                    {/*        width: 190,*/}
                    {/*        height: 17,*/}
                    {/*    }}>*/}
                    {/*    {data?.description}*/}
                    {/*</p>*/}
                </div>),
        },
        {
            name: Lang.get("Docs"),
            width: 100,
            key:'count',
        },
        {
            name: Lang.get("Status"),
            render: (data) => renderStatusColumn(data.status),
        },
        {
            name: Lang.get("Members"),
            render: (data) => (
                <Members
                    tab={true}
                    id={data.id}
                    users={data.members}
                    ids={data.members.ids}
                    toggleUrl="workspaceUsers"
                    permissionsUrl="permissions"
                    userListUrl="userList"
                    toggleParams={{
                        cardKey: "workspace_id",
                        userKey: "user_id",
                    }}
                    permissionParams={{
                        cardKey: "workspace_id",
                        userKey: "user_id",
                    }}
                />
            ),
        },
        {
            name: Lang.get("CreatedAt"),
            center: false,
            sort: "created_at",
            render: (data) => <SimpleDate date={data?.created_at}/>,
        },
        {
            center: true,
            width: 50,
            render: (data) => (
                <div>
                    <button
                        data-toggle="dropdown"
                        className="btn shadow-none bg-transparent feather feather-more-vertical p-0"
                        style={{fontSize: "1.2rem"}}
                    />
                    <div className="dropdown-menu">
                        <Link to={`docs/${data?.id}`} className="dropdown-item">
                            {Lang.get("Docs")}
                        </Link>

                        <Link
                            to={`${path}/edit/${data?.id}/${data?.title?.substring(0, 20)}`}
                            className="dropdown-item"
                        >
                            {Lang.get("Edit")}
                        </Link>
                        {data.count > 0 && (
                            <a className="dropdown-item"
                               href={Api.convert(API_ROUTES.docsExport) + `?data[workspace_id]=${data.id}`}
                               target="_blank"
                               download
                            >
                                {Lang.get("Export")}
                            </a>
                        )}

                        <button
                            className="dropdown-item text-danger"
                            onClick={() => App.deleteModal(() => onDelete(data.id))}
                        >
                            {Lang.get("Delete")}
                        </button>
                    </div>
                </div>
            ),
        },
    ];


    const onDelete = async (id) => {
        let response = await workspacesDelete({id});

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
            setState({selectedIDs: state.selectedIDs.filter((item) => item !== id),});
        } else {
            setState({selectedIDs: state.selectedIDs.concat([id])});
        }
    }

    const onSelectAll = () => {
        if (state.data.every((item) => state.selectedIDs.includes(item.id))) {
            setState({selectedIDs: []});
        } else {
            setState({selectedIDs: state.data.map((item) => item.id)});
        }
    }

    
    return (
        <ErrorBoundary>
   
            <Table
                data={state.data}
                loading={state.loading}
                columns={{ all: columns, hidden: state.hiddenColumns}}
                pagination={{
                    skip: state.skip,
                    limit: state.limit,
                    count: state.count,
                    onTake: (limit) => setState({limit}),
                    onPaginate: (page) => loadData({skip: page * state.limit}),
                }}
                sortable={{
                    sort: state.sort,
                    sortType: state.sort_type,
                    onSort: (sort) => setState({...sort}),
                }}
                select={{
                    selectedIDs: state.selectedIDs,
                    onSelect: onSelect,
                    onSelectAll: onSelectAll,
                }}
            />


        </ErrorBoundary>
    );
};
