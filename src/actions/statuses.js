import { Api } from "fogito-core-ui";

export const statusMinList = (params) => {
    return Api.post("statusMinList", {data:params});
};

export const statusCreate = (params) => {
    return Api.post("statusCreate", {data:params});
};

export const statusEdit = (params) => {
    return Api.post("statusEdit", {data:params});
};

export const statusDelete = (params) => {
    return Api.post("statusDelete", {data:params});
};


export const statusMove= (params) => {
    return Api.post("statusMove", {data:params});
};

export const statusDefault= (params) => {
    return Api.post("statusDefault", {data:params});
};





