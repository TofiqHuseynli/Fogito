import React from "react";

export const Header = ({ children }) => {
    return (
      <header className="content-header d-flex align-items-center px-md-3 px-2 py-2"  >
          {children}
      </header>
  );
};
