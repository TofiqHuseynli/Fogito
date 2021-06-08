import React from "react";
import classNames from "classnames";
import { SidebarContext } from "@contexts";

export const Content = ({ children }) => {
  const { mode } = React.useContext(SidebarContext);

    const checkDocs = () =>{
        let pathArray = location.pathname.split('/');
        return pathArray[1] === 'docs'
    }

  return (
    <section
      className={classNames(`${!checkDocs() && 'frame-content position-relative'}`, {
        "sidebar-opened": mode === "opened",
        "sidebar-closed": mode === "closed",
      })}
    >
      {children}
    </section>
  );
};
