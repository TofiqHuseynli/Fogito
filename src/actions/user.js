import { Api } from "fogito-core-ui";

// All User
export const userList = (params) => {
  return Api.get("userList", params);
};


export const projectUsersList = (params) => {
  return Api.get("projectUsersList", params);
};

export const projectUsersAdd = (params) => {
  return Api.get("projectUsersAdd", params);
};

export const projectUsersDelete = (params) => {
  return Api.get("projectUsersDelete", params);
};

export const userPermissionList = (params) => {
  return Api.get("userPermissionList", { data: params });
};

export const userPermissionSet = (params) => {
  return Api.post("userPermissionSet", { data: params });
};
