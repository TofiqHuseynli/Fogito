import {Api} from "@plugins";

export const documentationStripe = (params) => {
    return Api.post("documentationStripe", params);
};


