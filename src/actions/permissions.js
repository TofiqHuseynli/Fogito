import {Api} from "fogito-core-ui";

export const permissionsList = (params) => {
    return Api.post("permissionsList", {data:params});
};

export const permissionsSet = (params) => {
    return Api.post("permissionsSet", {data:params});
};
