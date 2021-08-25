import React from "react";

import {
  Docs,
  Projects,
} from "@layouts";
import {Edit} from "../layouts/Projects/components";
import {proxyRequest} from "@actions";

export const CRM_API_URL = "https://crm.fogito.com";
export const FILE_API_URL = "https://files.fogito.com";
export const API_DOC_PANEL  = "https://docs.fogito.com";


export const API_ROUTES = {
  // Settings
  settings: CRM_API_URL + "/settings",
  translations: CRM_API_URL + "/settings/translations",

  // Users
  userList: CRM_API_URL + "/users/recommendations/list",

  // Projects
  projectsCreate:          API_DOC_PANEL + "/projects/create",
  projectsDelete:          API_DOC_PANEL + "/projects/delete",
  projectsList:            API_DOC_PANEL + "/projects/list",
  projectsMinList:         API_DOC_PANEL + "/projects/min-list",
  projectsUpdate:          API_DOC_PANEL + "/projects/update",
  projectsInfo:            API_DOC_PANEL + "/projects/info",
  projectsData:            API_DOC_PANEL + "/projects/data",

  // Apis
  apisCreate:              API_DOC_PANEL + "/apis/create",
  apisUpdate:              API_DOC_PANEL + "/apis/update",
  apisList:                API_DOC_PANEL + "/apis/list",
  apisMinList:             API_DOC_PANEL + "/apis/min-list",
  apisCreateSub:           API_DOC_PANEL + "/apis/create-sub",
  apisInfo:                API_DOC_PANEL + "/apis/info",
  apisDelete:              API_DOC_PANEL + "/apis/delete",
  apisMove:                API_DOC_PANEL + "/apis/move",
  apisData:                API_DOC_PANEL + "/apis/data",
  apisCopy:                API_DOC_PANEL + "/apis/copy",
  apisExport:              API_DOC_PANEL + "/apis/export",
  apisImport:              API_DOC_PANEL + "/apis/import",

  // Documentation
  documentationList:       API_DOC_PANEL + "/documentation/list",
  documentationInfo:       API_DOC_PANEL + "/documentation/info",
  documentationStripe:     API_DOC_PANEL + "/documentation/list",

  // Project Users
  projectUsersList:        API_DOC_PANEL + "/projects/users/list",
  projectUsersAdd:         API_DOC_PANEL + "/projects/users/add",
  projectUsersDelete:      API_DOC_PANEL + "/projects/users/delete",
  projectUsersLeave:       API_DOC_PANEL + "/projects/users/leave",

  // Permissions List
  permissionsList:         API_DOC_PANEL + "/permissions/list",
  permissionsSet:          API_DOC_PANEL + "/permissions/set",

  // Proxy
  proxyList:               API_DOC_PANEL + "/requests/list",
  proxyRequest:            API_DOC_PANEL + "/requests/proxy",
};


export const MENU_ROUTES = [
  {
    path: "/projects",
    name: "Projects",
    icon: <i className="symbol feather feather-list text-muted" />,
    isExact: true,
    isHidden: false,
    component: (props) => <Projects {...props} type='projects' />,
  },
  {
    path: "/projects/edit/:id/:title",
    name: "Project Edit",
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
