import { Api } from "@plugins";

export const apisList = (params) => {
    return Api.post("apisList", params);
};

export const apisMinList = (params) => {
    return Api.post("apisMinList", params);
};

export const apisCreateSub = (params) => {
    return Api.post("apisCreateSub", params);
};

export const apisCreate = (params) => {
    return Api.post("apisCreate", params);
};

export const apisDelete = (params) => {
    return Api.post("apisDelete", params);
};

export const apisUpdate = (params) => {
    return Api.post("apisUpdate", params);
};

export const apisData = (params) => {
    return Api.post("apisData", params);
};

export const apisInfo = (params) => {
    return Api.post("apisInfo", params);
};

export const apisMove = (url, obj) => {
    return Api.post("apisMove", (url, obj));
};

export const apisCopy = (url, obj) => {
    return Api.post("apisCopy", (url, obj));
};

export const permissionsList = (params) => {
    return Api.post("permissionsList", params);
};

export const permissionsSet = (params) => {
    return Api.post("permissionsSet", params);
};
