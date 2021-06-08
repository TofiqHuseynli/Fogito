import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "@contexts";
import { App } from "@layouts";
import "antd/dist/antd.css";
import "./assets/index.scss";

ReactDOM.render(
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <AppProvider>
      <App />
    </AppProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
