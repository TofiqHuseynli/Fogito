import React from "react";
import { Link, Route } from "react-router-dom";
import { projectsDelete, projectsList } from "@actions";
import { Add, Edit } from "./components";
import { App, Lang } from "@plugins";
import {
  ErrorBoundary,
  Header,
  Loading,
  Members,
  Table,
  useModal,
  AppContext,
  useToast,
} from "fogito-core-ui";

export const Projects = ({ name, history, match: { url, path }, type }) => {
  const [state, setState] = React.useReducer(
    (prevState, newState) => ({
      ...prevState,
      ...newState,
    }),
    {
      loading: false,
      selectedIDs: [],
      data: [],
      limit: 10,
      count: 0,
      skip: 0,
      sort: {
        field: "created_at",
        order: "desc",
      },
    }
  );

  const modal = useModal();
  const toast = useToast();

  const { setProps } = React.useContext(AppContext);

  const loadData = async (params) => {
    setState({ loading: true, skip: params?.skip || 0 });

    let requestParams = {
      limit: state.limit,
      skip: state.skip,
      sort: state.sort,
      ...params,
    };
    let response = await projectsList(requestParams);
    if (response) {
      setState({ loading: false });
      if (response.status === "success") {
        let _data = response.data.map((project) => ({
          ...project,
          userIds: project.members?.data.map((member) => member.id),
        }));
        setState({ data: _data, count: response.count });
      } else {
        setState({ data: [], count: 0 });
      }
    }
  };

  const onDelete = (array) => {
    if (state.selectedIDs.length > 0) {
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
              setState({ loading: true });
              let response = await projectsDelete({ id });
              if (response?.status === "success" && count >= total) {
                setState({ loading: false, selectedIDs: [] });
                toast.fire({
                  title: response.description,
                  icon: "success",
                });
                loadData();
              }
              if (response.status === "success" && count < total) {
                count++;
              }
              if (response.status !== "success") {
                setState({ loading: false });
                toast.fire({
                  title: response.description,
                  icon: "error",
                });
              }
            });
          }
        });
    }
  };

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
  }, [state.limit, state.sort]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    setProps({ activeRoute: { name, path } });
    return () => {
      setProps({ activeRoute: { name: null, path: null } });
    };
  }, []);

  // Render Table
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
      render: (data) =>
        data.members?.count > 0 ? (
          <Members
            tab={true}
            id={data.id}
            users={data.members}
            ids={data.userIds}
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
      // dropdown menu
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
      {/* MODALs */}
      <Route
        path={`${path}/add`}
        render={(routeProps) => (
          <Add
            {...routeProps}
            refresh={() => loadData()}
            onClose={() => history.push(url)}
          />
        )}
      />
      <Route
        path={`${path}/edit/:id`}
        render={(routeProps) => (
          <Edit
            {...routeProps}
            refresh={() => loadData()}
            onClose={() => history.push(url)}
          />
        )}
      />

      {/*** HEADER ***/}
      <Header>
        <div className="col d-flex justify-content-between align-items-center px-0">
          {/* header delete button */}
          <div className="col-md-1 pl-0">
            <button
              className="btn btn-danger btn-block lh-24 "
              onClick={() => onDelete(selectedIDs)}
              style={{ opacity: state.selectedIDs.length > 0 ? 1 : 0.7 }}
            >
              <i className="feather feather-trash-2 fs-18 align-middle" />
            </button>
          </div>

          <h3 className="text-primary">{Lang.get(name)}</h3>

          {/* header add button */}
          <div className="col-md-1 pr-0">
            <Link
              to={`${path}/add`}
              className="btn btn-primary btn-block lh-24 px-3"
              // onClick={() => modal.show("add")}
            >
              <i className="feather feather-plus fs-18 align-middle" />
            </Link>
          </div>
        </div>
      </Header>

      {/*** CONTENT ***/}
      <section className="container-fluid position-relative px-md-3 px-2 pb-1">
        {state.loading && <Loading />}
        <Table
          data={state.data}
          columns={{ all: columns, hidden: [], required: 1 }}
          pagination={{
            skip: state.skip,
            limit: state.limit,
            count: state.count,
            onTake: (take) => setState({ limit: take }),
            onPaginate: (data) => loadData({ skip: data * state.limit }),
          }}
          sortable={{
            sort: state.sort.field,
            sortType: state.sort.order,
            onSort: (data) => setState({ sort: data }),
          }}
          select={{
            selectable: true,
            selectedIDS: state.selectedIDs,
            onSelect: (id) => {
              if (state.selectedIDs.includes(id)) {
                setState({
                  selectedIDs: selectedIDs.filter((item) => item !== id),
                });
              } else {
                setState({ setState: selectedIDs.concat([id]) });
              }
            },
            onSelectAll: () => {
              if (state.selectedIDs.length) {
                setState({ selectedIDs: [] });
              } else {
                setState({ selectedIDs: state.data.map((item) => item.id) });
              }
            },
          }}
        />
      </section>
    </ErrorBoundary>
  );
};
