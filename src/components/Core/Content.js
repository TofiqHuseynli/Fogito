import React from "react";

export const Content = ({ children }) => {

  return (
    <section className={'frame-content position-relative'}>
      {children}
    </section>
  );
};
