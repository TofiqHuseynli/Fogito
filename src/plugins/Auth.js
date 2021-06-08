import { useCookie } from "@hooks";
import { inArray } from "@lib";

const cookie = useCookie();
export class Auth {
  static data = {
    genders: [
      { value: "male", title: "Male" },
      { value: "female", title: "Female" },
    ],
  };

  static get(key) {
    return this.data ? this.data[key] : null;
  }
  static getData() {
    return this.data;
  }
  static setData(data) {
    this.data = {
      ...this.data,
      ...data,
    };
  }
  static isAuth() {
    return this.data.id ? true : false;
  }
  static isPermitted(view, action, selected = false) {
    let permission = this.data?.permissions[`${view}_${action}`];
    if (selected) {
      let selectedViews = (permission && permission.selected) || [];
      return inArray(selected, selectedViews) ? true : false;
    } else {
      return permission?.allow;
    }
  }
  static logOut() {
    cookie.remove("_token");
    window.location.reload();
  }
}
