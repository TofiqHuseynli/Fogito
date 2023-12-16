import { Api } from "fogito-core-ui";


export const snippetsParameter = (params) => {
    return Api.post("snippetsParameter", {data:params});
};