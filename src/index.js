import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "fogito-core-ui";
import ConfigProvider from "antd/lib/config-provider";
import en_GB from "antd/lib/locale-provider/en_GB";
import { App } from "@layouts";
import "antd/dist/antd.css";
import "./assets/index.scss";

ReactDOM.render(
    <BrowserRouter basename={process.env.publicPath}>
        <ConfigProvider locale={en_GB}>
            <AppProvider>
                <App />
            </AppProvider>
        </ConfigProvider>
    </BrowserRouter>,
  document.getElementById("root")
);
