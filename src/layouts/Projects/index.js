import React from "react";
import classNames from "classnames";
import Tooltip from "antd/lib/tooltip";
import { Link } from "react-router-dom";
import { ProjectUsersTooltip } from "@components";
import { projectsDelete, projectsList } from "@actions";
import { Add, Edit } from "./components";
import { App, Lang } from "@plugins";
import {
  ErrorBoundary,
  Header,
  Loading,
  Popup,
  Members,
  Table,
  useModal,
  AppContext,
  useToast,
} from "fogito-core-ui";

export const Projects = ({ name, match: { path }, type }) => {
  const modal = useModal();
  const toast = useToast();

  const { setProps } = React.useContext(AppContext);

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
  const [employees, setEmployees] = React.useState({});

  const loadData = async (params) => {
    setLoading(true);
    setSkip(params?.skip || 0);
    let requestParams = {
      limit,
      skip: params?.skip || 0,
      sort,
      ...params,
    };
    let response = await projectsList(requestParams);
    if (response) {
      setLoading(false);
      if (response.status === "success") {
        let _data = response.data.map((project) => ({
          ...project,
          userIds: project.members?.data.map((member) => member.id),
        }));
        setData(_data);
        console.log("clgData project", response.data);
        setCount(response.count);
        setEmployees(data.members);
      } else {
        setData([]);
        setCount(0);
      }
    }
  };

  const onDelete = (array) =>
    selectedIDs.length > 0 &&
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
            let response = null;
            response = await projectsDelete({ id });
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

  const oneProjectDelete = async (id) => {
    let response = await projectsDelete({ id });
    if (response.status === "success") {
      toast.fire({
        title: response.description,
        icon: "success",
      });
      loadData();
    } else {
      toast.fire({
        title: response.description,
        icon: "error",
      });
    }
  };

  React.useEffect(() => {
    loadData();
  }, [limit, sort]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    setProps({ activeRoute: { name, path } });
    return () => {
      setProps({ activeRoute: { name: null, path: null } });
    };
  }, []);

  //Table options
  const columns = [
    {
      width: 700,
      name: Lang.get("Title"),
      sort: "created_at",
      render: (data) => (
        <Link
          to={`docs/${data?.id}`}
          className="table-line"
          style={{
            wordBreak: "break-all",
            whiteSpace: "pre-wrap",
            padding: "20px 10px",
          }}
        >
          <div className="table-line-title">{data.title}</div>
        </Link>
      ),
    },
    {
      name: Lang.get("Users"),
      render: (project) =>
        project.members?.count > 0 ? (
          <Members
            tab={true}
            id={project.id}
            users={project.members}
            ids={project.userIds}
            toggleUrl="projectUsers" // this url must come from routes. (like /cards/users)
            permissionsUrl="permissions" // this url must come from routes. (like /cards/permissions)
            userListUrl="userList"
            toggleParams={{
              cardKey: "project_id",
              userKey: "user_id",
            }}
            permissionParams={{
              cardKey: "project_id",
              userKey: "user_id",
            }}
          />
        ) : (
          <span className="text-muted">{Lang.get("noUser")}</span>
        ),
    },
    {
      width: 160,
      center: true,
      name: Lang.get("Docs"),
      render: (data) => (
        <div
          className={"table-line d-flex justify-content-center"}
          style={{
            wordBreak: "break-all",
            whiteSpace: "pre-wrap",
            padding: "20px 10px",
          }}
        >
          <p className="table-line-title m-0">
            {data.count ? `${data.count}` : <div className="text-muted">0</div>}
          </p>
        </div>
      ),
    },
    {
      name: Lang.get("Status"),
      center: true,
      render: (data) => {
        return (
          <div className="d-flex justify-content-center">
            <span
              style={{ width: 100, fontSize: 11 }}
              className={`badge badge-${getStatus(data.status.label)} m-0 ml-2`}
            >
              {Lang.get(data.status.label)}
            </span>
          </div>
        );
      },
    },
    {
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
            <Link
              to={`${path}/edit/${data?.id}/${data?.title?.substring(0, 20)}`}
              className="dropdown-item"
            >
              {Lang.get("Edit")}
            </Link>
            <Link to={`docs/${data?.id}`} className="dropdown-item">
              {Lang.get("Docs")}
            </Link>
            <button
              className="dropdown-item text-danger"
              onClick={() => App.deleteModal(() => oneProjectDelete(data.id))}
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
      case "Closed":
        return "danger";
      case "Active":
        return "success";
      case "InProgress":
        return "warning";
    }
  };

  return (
    <ErrorBoundary>
      {/*** Modals ***/}
      <Popup
        show={modal.modals.includes("add")}
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
              style={{ opacity: selectedIDs.length > 0 ? 1 : 0.7 }}
            >
              <i className="feather feather-trash-2 fs-18 align-middle" />
            </button>
          </div>

          <h3 className="text-primary">{Lang.get(name)}</h3>

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
        {loading && <Loading />}
        <Table
          data={data}
          columns={{ all: columns, hidden: [], required: 1 }}
          pagination={{
            skip,
            limit,
            count,
            onTake: (take) => setLimit(take),
            onPaginate: (data) => loadData({ skip: data * limit }),
          }}
          sortable={{
            sort: sort.field,
            sortType: sort.order,
            onSort: (data) => setSort(data),
          }}
          select={{
            selectable: true,
            selectedIDs,
            onSelect: (id) => {
              if (selectedIDs.includes(id)) {
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
          }}
        />
      </section>
    </ErrorBoundary>
  );
};
