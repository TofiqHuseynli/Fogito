import { Api } from "fogito-core-ui";

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

export const apisCopy = (params) => {
    return Api.post("apisCopy", params);
};

export const apisExport = (params) => {
    return Api.post("apisExport", (params));
};

export const apisImport = (params) => {
    return Api.post("apisImport", (params));
};