import {Api} from "fogito-core-ui";

export const requestsList = (params) => {
    return Api.get("requestsList", {data:params});
};

export const requestsProxy = (params) => {
    return Api.post("requestsProxy", {data:params});
};

export const requestsCreate = (params) => {
    return Api.post("requestsCreate", {data:params});
};

export const requestsDelete = (params) => {
    return Api.post("requestsDelete", {data:params});
};

export const requestsEdit = (params) => {
    return Api.post("requestsEdit", {data:params});
};
