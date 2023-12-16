import React from "react";
import moment from "moment";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { Draggable } from "react-beautiful-dnd";
import { ErrorBoundary, Avatar, useToast, Auth, Lang } from "fogito-core-ui";
import {
  taskComplete,
  taskUnComplete,
  taskUpdate,
  taskUserAdd,
  taskUserDelete,
  taskWatch,
} from "@actions";
import { Spinner } from "@components";

export const Task = React.memo(
  ({
    url,
    is_archived,
    email,
    id,
    title,
    receiver,
    labels,
    announce_count,
    is_card_user,
    users,
    completed,
    watch,
    index,
    reload,
    path

  }) => {
    const toast = useToast();
    const [state, setState] = React.useReducer(
      (prevState, newState) => ({ ...prevState, ...newState }),
      {
        watching: watch,
        loading: false,
        join: is_card_user,
        users: users,
        statusValue: completed,
        setting: false,
        oldTitle: title,
        params: {
          id,
          type: "title",
          value: title,
        },
      }
    );

    const onSubmit = async (e) => {
      e.preventDefault();
      let response = await taskUpdate(state.params);
      if (response?.status === "success") {
        setState({ oldTitle: state.params.value, setting: false });
        reload();
      } else {
        toast.fire({ icon: "error", title: response.description });
      }
    };







    React.useEffect(() => {
      setState({ oldTitle: title, watching: watch, statusValue: completed });
    }, [title, watch, completed]);

    return (
      <ErrorBoundary>
        {/* <Settings
          show={state.setting}
          onClose={() => setState({ setting: null })}
        >
          <form onSubmit={onSubmit}>
            <div className="form-group mb-2">
              <textarea
                autoFocus
                className="form-control border-0 rounded-0"
                style={{ height: state.setting?.height }}
                value={state.params.value}
                onChange={(e) =>
                  setState({
                    params: { ...state.params, value: e.target.value },
                  })
                }
                onFocus={(e) => {
                  let length = e.target.value.length;
                  e.target.setSelectionRange(length, length);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    return false;
                  }
                }}
                onKeyDown={(e) => {
                  if (e.keyCode === 27) {
                    setState({ setting: false });
                  }
                }}
              />
            </div>
            <div className="form-group mb-0">
              <button className="btn btn-sm btn-primary px-4">
                {Lang.get("Save")}
              </button>
            </div>
          </form>
          <div
            className="dropdown-menu show shadow-none rounded-0 m-0 p-0"
            style={{
              top:
                state.setting?.y + state.setting?.height + 230 <=
                window.innerHeight
                  ? 0
                  : "auto",
              bottom:
                state.setting?.y + state.setting?.height + 230 >
                window.innerHeight
                  ? 0
                  : "auto",
              left:
                state.setting?.x + state.setting?.width + 150 <=
                window.innerWidth
                  ? "100%"
                  : "auto",
              right:
                state.setting?.x + state.setting?.width + 150 >
                window.innerWidth
                  ? "100%"
                  : "auto",
              width: 150,
              minWidth: 150,
            }}
          >
            <Link
              to={
                url +
                `/${id}/${title
                  ?.slice(0, 50)
                  ?.replace(/[\-]/g, " ")
                  .replace(/[\.]/g, "")
                  .replace(/[\W_]+/g, " ")
                  .trim()
                  .replace(/\s+/g, "-")}`
              }
              onClick={() => setState({ setting: null })}
              className="dropdown-item"
            >
              {Lang.get("Edit")}
            </Link>
            <button
              className="dropdown-item"
              onClick={() => onUserToggle(users, state.join)}
            >
              {Lang.get(state.join ? "Leave" : "Join")}
            </button>
            <button
              className="dropdown-item d-flex align-items-center justify-content-between"
              onClick={() => onStatus(!state.statusValue)}
            >
              {Lang.get(
                `${state.statusValue == 0 ? "Complete" : "UnComplete"}`
              )}
              {state.loading && <Spinner size="15" />}
            </button>
            <button
              className="dropdown-item d-flex align-items-center"
              onClick={() =>
                setState({ setting: null }) + onWatch(!state.watching)
              }
            >
              {Lang.get("Watch")}
              {state.watching == true && (
                <i className="feather feather-check ml-auto mr-0" />
              )}
            </button>
            <button className="dropdown-item">{Lang.get("Share")}</button>
            <button
              className="dropdown-item"
              onClick={() =>
                setState({ setting: null }) +
                onMove({ id, index, column, type: "task" })
              }
            >
              {Lang.get("Move")}
            </button>
            <button
              className="dropdown-item"
              onClick={() => setState({ setting: null }) + onAction("delete")}
            >
              {Lang.get("Delete")}
            </button>
            <button
              className="dropdown-item"
              onClick={() => {
                if (is_archived) {
                  setState({ setting: null });
                  unArchive("task", id);
                } else {
                  setState({ setting: null });
                  onAction("archive");
                }
              }}
            >
              {Lang.get(is_archived ? "UnArchived" : "Archived")}
            </button>
          </div>
        </Settings> */}
        <Draggable draggableId={id} index={index}>
          {(provided, snapshot) => (
            <div
              className={classNames("task", { dragging: snapshot.isDragging })}
              onContextMenu={(e) => {
                e.preventDefault();
                setState({ setting: e.currentTarget.getBoundingClientRect() });
              }}
              {...provided.dragHandleProps}
              {...provided.draggableProps}
              ref={provided.innerRef}
            >
              <Link 
                to={`${path}/edit/${id}`}>
                <div className="kanban-task">
                  <p className="text-primary">{receiver}</p>
                  <p className="text-primary-alternative fs-14">{email}</p>
                </div>
              </Link>
            </div>
          )}
        </Draggable>
      </ErrorBoundary>
    );
  }
);

export const Settings = ({ show, onClose, children }) => {
  if (!show) {
    document.body.removeAttribute("style");
    return null;
  } else {
    document.body.style.overflow = "hidden";
    return createPortal(
      <div className="modal" onClick={onClose}>
        <div
          className="position-absolute"
          style={{
            top: show?.y,
            left: show?.x,
            width: show?.width,
            height: show?.height,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>,
      document.body
    );
  }
};
