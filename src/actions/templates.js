import { Api } from "fogito-core-ui";

export const templateList = (params) => {
    return Api.post("templateList", {data:params});
};

export const templateDelete = (params) => {
    return Api.post("templateDelete", {data:params});
};

export const templateMinList = (params) => {
    return Api.get("templateMinList", {data:params});
};
