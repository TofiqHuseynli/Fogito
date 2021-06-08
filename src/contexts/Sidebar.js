import React from "react";
import { useCookie } from "@hooks";

export const SidebarContext = React.createContext({
  mode: false,
});

export const SidebarProvider = ({ children }) => {
  const cookie = useCookie();
  const [mode, setmode] = React.useState(
    cookie.get("_sidebar") === "opened" ? "opened" : "closed"
  );

  const setMode = (value) =>
    value === "opened"
      ? setmode(value) + cookie.set("_sidebar", value, 30)
      : setmode(value) + cookie.set("_sidebar", value, 30);

  return (
    <SidebarContext.Provider value={{ mode, setMode }}>
      {children}
    </SidebarContext.Provider>
  );
};
