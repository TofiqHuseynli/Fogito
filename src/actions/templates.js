import { Api } from "fogito-core-ui";

export const templateList = (params) => {
    return Api.post("templateList", {data:params});
};

export const templateCreate = (params) => {
    return Api.get("templateCreate", {data:params});
};

export const templateUpdate = (params) => {
    return Api.post("templateUpdate", {data:params});
};

export const templateDelete = (params) => {
    return Api.post("templateDelete", {data:params});
};

export const templateMinList = (params) => {
    return Api.get("templateMinList", {data:params});
};


export const templateArchive = (params) => {
    return Api.get("templateArchive", {data:params});
};

export const templateInfo = (params) => {
    return Api.get("templateInfo", {data:params});
};




