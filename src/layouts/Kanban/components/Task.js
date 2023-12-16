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
    email,
    id,
    title,
    receiver,
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
    React.useEffect(() => {
      setState({ oldTitle: title, watching: watch, statusValue: completed });
    }, [title, watch, completed]);

    return (
      <ErrorBoundary>
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
