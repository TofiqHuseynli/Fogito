import moment from "moment-timezone";
import { API_ROUTES, config } from "@config";
import { serializeQuery } from "@lib";
import { Auth, Lang } from "./";

export class Api {
  static routes = API_ROUTES;

  static async request(url, method = "GET", params) {
    return await fetch(
      method === "GET"
        ? `${this.routes[url]}?${serializeQuery(this.filterParams(params))}`
        : this.routes[url],
      {
        method,
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body:
          method !== "GET" ? JSON.stringify(this.filterParams(params)) : null,
      }
    )
      .then(async (res) => {
        const response = await res.json();
        if (response.error_code === 1001) {
          //   Auth.logOut();
          return;
        }
        return response;
      })
      .catch((err) => {
        throw new Error(err);
      });
  }
  static async get(url, params) {
    return await this.request(url, "GET", params);
  }
  static async post(url, params) {
    return await this.request(url, "POST", params);
  }
  static async put(url, params) {
    return await this.request(url, "PUT", params);
  }
  static async del(url, params) {
    return await this.request(url, "DELETE", params);
  }
  static filterParams(params) {
    let token = Auth.get("token");
    let token_user = Auth.get("_id");
    let lang = Lang.getLang();
    let obj = {
      app_id: config.appID,
      env: process.env.NODE_ENV,
      tz: moment.tz.guess(),
      ts: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    };
    if (token) {
      obj.token = token;
    }
    if (token_user) {
      obj.token_user = token_user;
    }
    if (lang) {
      obj.lang = lang;
    }
    if (params) {
      Object.keys(params).map((key) => {
        let value = params[key];
        if (!value) {
          value = "";
        }
        obj[key] = value;
        return obj;
      });
    }
    return obj;
  }
}
