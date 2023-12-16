import { Api } from "fogito-core-ui";

export const groupsList = (params) => {
    return Api.post("groupsList", {data:params});
};

export const groupsMinList = (params) => {
    return Api.get("groupsMinList", {data:params});
};

export const groupsCreate = (params) => {
    return Api.post("groupsCreate", {data:params});
};

export const groupsDelete = (params) => {
    return Api.post("groupsDelete", {data:params});
};

export const groupsInfo = (params) => {
    return Api.get("groupsInfo", {data:params});
};

export const groupsUpdate = (params) => {
    return Api.post("groupsUpdate", {data:params});
};


