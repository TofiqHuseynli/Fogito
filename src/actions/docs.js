import {Api} from "fogito-core-ui";

export const documentationStripe = (params) => {
    return Api.get("documentationStripe", {data:params});
};

export const docsList = (params) => {
    return Api.get("docsList", {data:params});
};

export const docsMinList = (params) => {
    return Api.get("docsMinList", {data:params});
};

export const docsCreateSub = (params) => {
    return Api.post("docsCreateSub", {data:params});
};

export const docsCreate = (params) => {
    return Api.post("docsCreate", {data:params});
};

export const docsDelete = (params) => {
    return Api.post("docsDelete", {data:params});
};

export const docsUpdate = (params) => {
    return Api.post("docsUpdate", {data:params});
};

export const docsData = (params) => {
    return Api.get("docsData", {data:params});
};

export const docsInfo = (params) => {
    return Api.get("docsInfo", {data:params});
};

export const docsMove = (params) => {
    return Api.post("docsMove", {data:params});
};

export const docsCopy = (params) => {
    return Api.post("docsCopy", {data:params});
};

export const docsExport = (params) => {
    return Api.post("docsExport", {data:params});
};

export const docsImport = (params) => {
    return Api.post("docsImport", {data:params});
};
