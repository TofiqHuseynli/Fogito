import React from "react";
import { ErrorBoundary, Lang, Table, SimpleDate, Members, useToast, Api } from "fogito-core-ui";
import { Link } from "react-router-dom";
import { App } from "@plugins";
import { renderStatusColumn } from "@layouts/Workspaces/actions";
import { API_ROUTES } from "@config";
import { groupsDelete, historyDelete, listDelete } from "@actions";
import { Button } from "antd";

export const TableHistory =({ state, setState, path, loadData })=>{

    const toast = useToast();

    const columns = [
        {
            name: Lang.get("RECEIVER"),
            width: 50,
            render: (data) => (
                <div className="user__content">
                    <Link to={{ pathname: `/docs/${data.receiver}` }} >{data.receiver}</Link>
                </div>),
        },

        {
            name: Lang.get("Templete"),
            width: 200,
            key:"template"
        },
        {
            name: Lang.get("E-MAIL"),
            width: 200,
            render: (data) => (
                <div className="user__content">
                    <Link to={{ pathname: `/docs/${data.email}` }} >{data.email}</Link>

                </div>),
        },


        {
            name: Lang.get("From"),
            width: 250,
            key:"from"
            
        },
        {
            name: Lang.get("TYPE"),
            width: 100,
            key: 'type'
            
            
        },
        {
            name: Lang.get("INFORMATION"),
            width: 100,
            render: (data) => (
                <div className="user__content">
                   {data?.info?.value}
                </div>),
            
            
        },
        {
            name: Lang.get("SEND DATE"),
            width: 100,
            center: false,
            render: (data) => <SimpleDate date={data?.send} />,
        },
        {
            name: Lang.get("ACTIONS"),
            center: true,
            width: 150,
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
        let response = await historyDelete({ id });

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
return(

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