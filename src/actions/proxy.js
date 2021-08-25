import {Api} from "fogito-core-ui";

export const proxyList = (params) => {
    return Api.post("proxyList", params);
};

export const proxyRequest = (params) => {
    return Api.post("proxyRequest", params);
};
