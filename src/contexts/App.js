import React from "react";

export const AppContext = React.createContext({
  props: null,
  methods: null,
  activeRoute: null,
});

export const AppProvider = ({ children }) => {
  const [props, setProp] = React.useState({});
  const [methods, setMethod] = React.useState({});
  const [activeRoute, setActiveRoute] = React.useState({});

  const setMethods = (data) => {
    setMethod((prevData) => ({ ...prevData, ...data }));
  };

  const setProps = (data) => {
    setProp((prevData) => ({ ...prevData, ...data }));
  };

  return (
    <AppContext.Provider
      value={{
        props,
        methods,
        activeRoute,
        setProps,
        setMethods,
        setActiveRoute,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
