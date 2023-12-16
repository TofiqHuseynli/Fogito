import { Api } from "fogito-core-ui";

export const listList = (params) => {
    return Api.post("listList", {data:params});
};

export const minList = (params) => {
    return Api.post("minList", {data:params});
};

export const infoLead = (params) => {
    return Api.post("infoLead", {data:params});
};

export const listCreate = (params) => {
    return Api.post("listCreate", {data:params});
};

export const listDelete = (params) => {
    return Api.post("listDelete", {data:params});
};

export const leadUpdate = (params) => {
    return Api.post("leadUpdate", {data:params});
};

export const leadArchive = (params) => {
    return Api.post("leadArchive", {data:params});
};

export const leadMove = (params) => {
    return Api.post("leadMove", {data:params});
};


