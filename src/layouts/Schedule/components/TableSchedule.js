import React from "react";
import {
  ErrorBoundary,
  Lang,
  Table,
  SimpleDate,
  Members,
  useToast,
  Api,
} from "fogito-core-ui";
import { Link } from "react-router-dom";
import { App } from "@plugins";
import { scheduleDelete, scheduleArchive } from "@actions";

export const TableSchedule = ({ state, setState, path, loadData, VIEW }) => {
  const toast = useToast();

  const columns = [
    {
      name: Lang.get("RECEIVER"),

      render: (data) => (
        <div className="user__content">
          <Link to={`${path}/edit/${data.id}`} style={{ color: "#52889e" }}>
            {data.target_type === "3" ? "Leads" : data.receiver}
          </Link>
        </div>
      ),
    },

    {
      name: Lang.get("LEAD GROUPS"),

      render: (data) => (
        <div className="user__content">
          <Link to={`${path}/edit/${data.id}`}>{data.groups}</Link>
        </div>
      ),
    },

    {
      name: Lang.get("TEMPLATE"),

      key: "template",
    },

    {
      name: Lang.get("E-MAIL"),

      key: "email",
    },

    {
      name: Lang.get("CREATE DATE"),

      center: false,
      sort: "created_at",
      render: (data) => <SimpleDate date={data.created_date} />,
    },
    {
      name: Lang.get("SEND DATE"),

      center: false,
      sort: "created_at",
      render: (data) => <SimpleDate date={data.send_date.default_unix_date} />,
    },
    {
      name: Lang.get("ACTIONS"),
      center: true,
      width: 150,
      render: (data) => (
        <div>
          <Link
            style={{ borderRadius: "50%" }}
            className="btn btn-outline-warning btn-sm h-auto lh-10 p-1 mb-2 mb-lg-0 mr-0 mx-2"
            to={`${path}/edit/${data.id}`}
          >
            <i className="feather feather-edit-2"></i>
          </Link>

          {data.archived == 1 ? (
            <button
              className="btn btn-outline-warning  btn-sm h-auto lh-10 p-1 mb-2 mb-lg-0 mr-0 "
              style={{ borderRadius: "50%" }}
              onClick={() => App.deleteModal(() => onActive(data.id))}
            >
              <i className="feather-rotate-ccw" />
            </button>
          ) : (
            <button
              className="btn btn-outline-primary  btn-sm h-auto lh-10 p-1 mb-2 mb-lg-0 mr-0 "
              style={{ borderRadius: "50%" }}
              onClick={() => App.deleteModal(() => onArchive(data.id))}
            >
              <i className="feather feather-archive" />
            </button>
          )}

          <button
            className="btn btn-outline-danger 
                       btn btn-outline-danger btn-sm h-auto lh-10 p-1 mb-2 mb-lg-0 mr-0 mx-2"
            style={{ borderRadius: "50%" }}
            onClick={() => App.deleteModal(() => onDelete(data.id))}
          >
            <i className="feather feather-x"></i>
          </button>
        </div>
      ),
    },
  ];

  const onDelete = async (id) => {
    let response = await scheduleDelete({ id });

    toast.fire({
      title: response.description,
      icon: response.status,
    });
    if (response.status === "success") {
      loadData();
    }
  };

  const onArchive = async (id) => {
    let response = await scheduleArchive({ id, archived: 1 });
    toast.fire({
      title: response.description,
      icon: response.status,
    });
    if (response.status === "success") {
      loadData();
    }
  };

  const onActive = async (id) => {
    let response = await scheduleArchive({ id, archived: 0 });
    toast.fire({
      title: response.description,
      icon: response.status,
    });
    if (response.status === "success") {
      loadData();
    }
  };

  const onSelect = (id) => {
    if (state.selectedIDs.includes(id)) {
      setState({
        selectedIDs: state.selectedIDs.filter((item) => item !== id),
      });
    } else {
      setState({ selectedIDs: state.selectedIDs.concat([id]) });
    }
  };

  const onSelectAll = () => {
    if (state.data.every((item) => state.selectedIDs.includes(item.id))) {
      setState({ selectedIDs: [] });
    } else {
      setState({ selectedIDs: state.data.map((item) => item.id) });
    }
  };

  return (
    <ErrorBoundary>
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
  );
};
