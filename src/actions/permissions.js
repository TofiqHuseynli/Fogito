import {Api} from "fogito-core-ui";

export const permissionsList = (params) => {
    return Api.post("permissionsList", params);
};

export const permissionsSet = (params) => {
    return Api.post("permissionsSet", params);
};
