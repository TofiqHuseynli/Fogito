import { Api } from "fogito-core-ui";

export const kanbanList = (params) => {
    return Api.post("kanbanList", {data:params});
};

export const kanbanDelete = (params) => {
    return Api.post("kanbanDelete", {data:params});
};

export const kanbanArchived = (params) => {
    return Api.post("kanbanArchived", {data:params});
};

