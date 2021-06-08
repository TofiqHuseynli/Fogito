import React from "react";
import classNames from "classnames";
import { ErrorBoundary } from "@components";
import { SidebarContext } from "@contexts";

export const Toggler = () => {
  const { mode, setMode } = React.useContext(SidebarContext);
  return (
    <ErrorBoundary>
      <button
        className={classNames(
          "frame-sidebar-toogler d-flex flex-column justify-content-around align-items-end",
          { toggled: mode === "opened" }
        )}
        onClick={() => setMode(mode === "opened" ? "closed" : "opened")}
      >
        <span className="line" />
        <span className="line" />
        <span className="line" />
      </button>
    </ErrorBoundary>
  );
};
