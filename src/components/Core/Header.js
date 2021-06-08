import React from "react";
import { useWindowDimensions } from "@hooks";
import { Toggler } from "./Sidebar/components";

export const Header = ({ children }) => {
  const dimensions = useWindowDimensions();

    const checkDocs = () =>{
        let pathArray = location.pathname.split('/');
        return pathArray[1] === 'docs'
    }

    return (
      <header className="content-header d-flex align-items-center px-md-3 px-2 py-2">
          {!checkDocs() && dimensions.width <= 1200 && <Toggler /> }
          {children}
      </header>
  );
};
