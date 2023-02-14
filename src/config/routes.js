import React from "react";
import {Docs, Workspaces} from "@layouts";
import {documentationStripe} from "@actions";


export const CORE_API_URL = "/core";
export const MICROSERVICE_URL = "/docs";

export const API_ROUTES = {
    // Settings
    settings: CORE_API_URL + "/settings",
    translations: CORE_API_URL + "/settings/translations",

    // Users
    userList: MICROSERVICE_URL + "/users/search",

    // Workspace
    workspacesCreate: MICROSERVICE_URL + "/workspaces/create",
    workspacesDelete: MICROSERVICE_URL + "/workspaces/delete",
    workspacesList: MICROSERVICE_URL + "/workspaces/list",
    workspacesMinList: MICROSERVICE_URL + "/workspaces/min-list",
    workspacesUpdate: MICROSERVICE_URL + "/workspaces/update",
    workspacesInfo: MICROSERVICE_URL + "/workspaces/info",
    workspacesData: MICROSERVICE_URL + "/workspaces/data",

    // Workspace Users
    workspaceUsersList: MICROSERVICE_URL + "/workspaces/users/list",
    workspaceUsersAdd: MICROSERVICE_URL + "/workspaces/users/add",
    workspaceUsersDelete: MICROSERVICE_URL + "/workspaces/users/delete",
    workspaceUsersOwnerSet: MICROSERVICE_URL + "/workspaces/users/setowner",

    // Workspace Permissions List
    permissionsList: MICROSERVICE_URL + "/permissions/list",
    permissionsSet: MICROSERVICE_URL + "/permissions/set",


    // requests
    requestsList: MICROSERVICE_URL + "/requests/list",
    requestsProxy: MICROSERVICE_URL + "/requests/proxy",
    requestsCreate: MICROSERVICE_URL + "/requests/create",
    requestsDelete: MICROSERVICE_URL + "/requests/delete",
    requestsEdit: MICROSERVICE_URL + "/requests/edit",

    // docs
    docsCreate: MICROSERVICE_URL + "/docs/create",
    docsCreateSub: MICROSERVICE_URL + "/docs/create-sub",
    docsUpdate: MICROSERVICE_URL + "/docs/update",
    docsList: MICROSERVICE_URL + "/docs/list",
    docsMinList: MICROSERVICE_URL + "/docs/min-list",
    docsInfo: MICROSERVICE_URL + "/docs/info",
    docsDelete: MICROSERVICE_URL + "/docs/delete",
    docsMove: MICROSERVICE_URL + "/docs/move",
    docsData: MICROSERVICE_URL + "/docs/data",
    docsCopy: MICROSERVICE_URL + "/docs/copy",
    docsExport: MICROSERVICE_URL + "/docs/export",
    docsImport: MICROSERVICE_URL + "/docs/import",
    docsUpdateField: MICROSERVICE_URL + "/docs/updatefield",

    // Documentation
    documentationStripe: MICROSERVICE_URL + "/documentation/list",
    documentationPrintable: MICROSERVICE_URL + "/documentation/printable",
};


export const MENU_ROUTES = [
    {
        path: "/docs",
        name: "TechnicalDocuments",
        icon: <i className="symbol feather feather-list text-muted"/>,
        isExact: false,
        isHidden: false,
        component: (props) => <Workspaces {...props} />,
    },
    {
        path: "/docs/:id?/:docs_id?",
        name: "Docs Panel",
        isExact: true,
        isHidden: true,
        component: (props) => <Docs {...props} />,
    },
];
