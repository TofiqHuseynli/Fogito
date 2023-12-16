import { Api } from "fogito-core-ui";

export const historyList = (params) => {
    return Api.post("historyList", {data:params});
};

export const historyDelete = (params) => {
    return Api.post("historyDelete", {data:params});
};

export const historyEmailtotal = (params) => {
    return Api.post("historyEmailtotal", {data:params});
};