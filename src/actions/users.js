import { Api } from "fogito-core-ui";

// All User
export const userList = (params) => {
  return Api.get("userList", {data:params});
};

export const workspaceUsersList = (params) => {
  return Api.get("workspaceUsersList", {data:params});
};

export const workspaceUsersAdd = (params) => {
  return Api.get("workspaceUsersAdd", {data:params});
};

export const workspaceUsersDelete = (params) => {
  return Api.get("workspaceUsersDelete", {data:params});
};

export const workspaceUsersOwnerSet = (params) => {
  return Api.get("workspaceUsersOwnerSet", {data:params});
};
