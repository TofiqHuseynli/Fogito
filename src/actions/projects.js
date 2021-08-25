import { Api } from "fogito-core-ui";

export const projectsList = (params) => {
    return Api.post("projectsList", params);
};

export const projectsMinList = (params) => {
    return Api.post("projectsMinList", params);
};

export const projectsCreate = (params) => {
    return Api.post("projectsCreate", params);
};

export const projectsDelete = (params) => {
    return Api.post("projectsDelete", params);
};

export const projectsInfo = (params) => {
    return Api.post("projectsInfo", params);
};

export const projectsUpdate = (params) => {
    return Api.post("projectsUpdate", params);
};

export const projectsData = (params) => {
    return Api.post("projectsData", params);
};
