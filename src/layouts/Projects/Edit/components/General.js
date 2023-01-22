import React from "react";
import { ErrorBoundary, Lang, Textarea, Members } from "fogito-core-ui";

export const General = ({ state, setState }) => {
  return (
    <ErrorBoundary>
      <div className="row">
        <div className="col-md-8">
          {/* Title */}
          <div className="form-group">
            <label>{Lang.get("Title")}</label>
            <Textarea
              rows="1"
              maxLength="300"
              value={state.data.title}
              id="title"
              onChange={(e) =>
                setState({ data: { ...state.data, title: e.target.value } })
              }
              placeholder={Lang.get("Title")}
              className="form-control"
            />
            <span className="text-muted fs-12 mt-1">
              {Lang.get("MaxLength").replace(
                "{length}",
                300 - state.data.title?.length
              )}
            </span>
          </div>
          {/* Description */}
          <div className="form-group">
            <label>{Lang.get("Description")}</label>
            <Textarea
              rows="2"
              maxLength="1500"
              value={state.description}
              onChange={(e) =>
                setState({
                  data: { ...state.data, description: e.target.value },
                })
              }
              placeholder={Lang.get("Description")}
              className="form-control"
            />
            <span className="text-muted fs-12 mt-1">
              {Lang.get("MaxLength").replace(
                "{length}",
                1500 - state.data.description?.length
              )}
            </span>
          </div>

          {/* Slug */}
          <div className="form-group">
            <label>{Lang.get("Slug")}</label>
            <Textarea
              rows="1"
              maxLength="300"
              value={state.data.slug}
              id="slug"
              onChange={(e) =>
                setState({ data: { ...state.data, slug: e.target.value } })
              }
              placeholder={Lang.get("Slug")}
              className="form-control"
            />
            <span className="text-muted fs-12 mt-1">
              {Lang.get("MaxLength").replace(
                "{length}",
                300 - state.data.slug?.length
              )}
            </span>
          </div>

          {/* API url and path */}
          <div className="row">
            {/* url */}
            <div className="col-md-4">
              <div className="form-group">
                <label>{Lang.get("ApiUrl")}</label>
                <Textarea
                  rows="1"
                  maxLength="300"
                  value={state.data.api_url}
                  id="api-url"
                  onChange={(e) =>
                    setState({
                      data: { ...state.data, api_url: e.target.value },
                    })
                  }
                  placeholder={Lang.get("ApiUrl")}
                  className="form-control"
                />
              </div>
            </div>
            {/* path */}
            <div className="col-md-4">
              <div className="form-group">
                <label>{Lang.get("ApiPath")}</label>
                <Textarea
                  rows="1"
                  maxLength="300"
                  value={state.data.api_path}
                  id="api-path"
                  onChange={(e) =>
                    setState({
                      data: { ...state.data, api_path: e.target.value },
                    })
                  }
                  placeholder={Lang.get("ApiPath")}
                  className="form-control"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          {/* Status */}
          <div className="form-group">
            <label>{Lang.get("Status")}</label>
            <select
              className="custom-select"
              id="status"
              onChange={(e) =>
                setState({
                  ...state,
                  data: {
                    ...state.data,
                    status: parseInt(e.target.value),
                  },
                })
              }
            >
              <option value="" selected="">
                {Lang.get("Select")}
              </option>
              {state.status_data.map((item, key) => (
                <option
                  value={item.value}
                  key={key}
                  selected={item.value === state.data.status?.value}
                >
                  {Lang.get(item.label)}
                </option>
              ))}
            </select>
          </div>

          {/* Public */}
          <div className="form-group">
            <label>{Lang.get("Public")}</label>
            <select
              className="custom-select"
              onChange={(e) =>
                setState({
                  ...state,
                  data: {
                    ...state.data,
                    public: parseInt(e.target.value),
                  },
                })
              }
            ></select>
          </div>

          {/* Staff */}
          <div className="form-group">
            <label>{Lang.get("Staff")}</label>
            <Members
              id={state.id}
              users={state.employees}
              ids={state.userIds}
              getIds={(userIds) => setState({ userIds })}
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
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};
