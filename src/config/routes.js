import React from "react";

import { Docs, Projects } from "@layouts";
import { Edit } from "../layouts/Projects/components";

export const CORE_API_URL = "/core";
export const MICROSERVICE_URL = "/docs";
export const FILE_API_URL = "/files";

export const API_ROUTES = {
  // Settings
  settings: CORE_API_URL + "/settings",
  translations: CORE_API_URL + "/settings/translations",

  // Users
  userList: CORE_API_URL + "/users/recommendations/list",

  // Projects
  projectsCreate: MICROSERVICE_URL + "/projects/create",
  projectsDelete: MICROSERVICE_URL + "/projects/delete",
  projectsList: MICROSERVICE_URL + "/projects/list",
  projectsMinList: MICROSERVICE_URL + "/projects/min-list",
  projectsUpdate: MICROSERVICE_URL + "/projects/update",
  projectsInfo: MICROSERVICE_URL + "/projects/info",
  projectsData: MICROSERVICE_URL + "/projects/data",

  // Apis
  apisCreate: MICROSERVICE_URL + "/apis/create",
  apisUpdate: MICROSERVICE_URL + "/apis/update",
  apisList: MICROSERVICE_URL + "/apis/list",
  apisMinList: MICROSERVICE_URL + "/apis/min-list",
  apisCreateSub: MICROSERVICE_URL + "/apis/create-sub",
  apisInfo: MICROSERVICE_URL + "/apis/info",
  apisDelete: MICROSERVICE_URL + "/apis/delete",
  apisMove: MICROSERVICE_URL + "/apis/move",
  apisData: MICROSERVICE_URL + "/apis/data",
  apisCopy: MICROSERVICE_URL + "/apis/copy",
  apisExport: MICROSERVICE_URL + "/apis/export",
  apisImport: MICROSERVICE_URL + "/apis/import",
  apisUpdateField: MICROSERVICE_URL + "/apis/updatefield",

  // Documentation
  documentationList: MICROSERVICE_URL + "/documentation/list",
  documentationInfo: MICROSERVICE_URL + "/documentation/info",
  documentationStripe: MICROSERVICE_URL + "/documentation/list",
  documentationPrintable: MICROSERVICE_URL + "/documentation/printable",

  // Project Users
  projectUsersList: MICROSERVICE_URL + "/projects/users/list",
  projectUsersAdd: MICROSERVICE_URL + "/projects/users/add",
  projectUsersDelete: MICROSERVICE_URL + "/projects/users/delete",
  projectUsersLeave: MICROSERVICE_URL + "/projects/users/leave",

  // Permissions List
  permissionsList: MICROSERVICE_URL + "/permissions/list",
  permissionsSet: MICROSERVICE_URL + "/permissions/set",

  // Proxy
  proxyList: MICROSERVICE_URL + "/requests/list",
  proxyRequest: MICROSERVICE_URL + "/requests/proxy",
  requestSave: MICROSERVICE_URL + "/requests/save",
  requestDelete: MICROSERVICE_URL + "/requests/delete",
  requestEdit: MICROSERVICE_URL + "/requests/edit",
  requestUpdateField: MICROSERVICE_URL + "/requests/updatefield",
};

export const MENU_ROUTES = [
  {
    path: "/projects",
    name: "TechnicalDocuments",
    icon: <i className="symbol feather feather-list text-muted" />,
    isExact: true,
    isHidden: false,
    component: (props) => <Projects {...props} type="projects" />,
  },
  {
    path: "/projects/edit/:id/:title",
    name: "Edit",
    isExact: true,
    isHidden: true,
    component: (props) => <Edit {...props} />,
  },
  {
    path: "/docs/:id?/:docs_id?",
    name: "Docs Panel",
    isExact: true,
    isHidden: true,
    component: (props) => <Docs {...props} />,
  },
];
