import { Api } from "fogito-core-ui";

export const scheduleList = (params) => {
    return Api.post("scheduleList", {data:params});
};


export const scheduleDelete = (params) => {
    return Api.post("scheduleDelete", {data:params});
};

export const scheduleEdit = (params) => {
    return Api.post("scheduleEdit", {data:params});
};

export const infoSchedule = (params) => {
    return Api.post("infoSchedule", {data:params});
};

export const scheduleCreate = (params) => {
    return Api.post("scheduleCreate", {data:params});
};

export const scheduleArchive = (params) => {
    return Api.post("scheduleArchive", {data:params});
};
