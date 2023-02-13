import { Api } from "fogito-core-ui";

export const workspacesList = (params) => {
    return Api.post("workspacesList", {data:params});
};

export const workspacesMinList = (params) => {
    return Api.post("workspacesMinList", {data:params});
};

export const workspacesCreate = (params) => {
    return Api.post("workspacesCreate", {data:params});
};

export const workspacesDelete = (params) => {
    return Api.post("workspacesDelete", {data:params});
};

export const workspacesInfo = (params) => {
    return Api.post("workspacesInfo", {data:params});
};

export const workspacesUpdate = (params) => {
    return Api.post("workspacesUpdate", {data:params});
};

export const workspacesData = (params) => {
    return Api.post("workspacesData", {data:params});
};
