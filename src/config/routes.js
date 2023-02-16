import React from "react";
import {Docs, Workspaces} from "@layouts";
import {parameters} from "@actions";

export const CORE_API_URL = "/core";
export const MICROSERVICE_URL = "/docs";

export const API_ROUTES = {
    // Settings
    settings: CORE_API_URL + "/settings",
    translations: CORE_API_URL + "/settings/translations",

    // Users
    userList: MICROSERVICE_URL + "/users/search",

    //parameters
    parameters: MICROSERVICE_URL + "/data/parameters",

    // Workspace
    workspacesCreate: MICROSERVICE_URL + "/workspaces/create",
    workspacesDelete: MICROSERVICE_URL + "/workspaces/delete",
    workspacesList: MICROSERVICE_URL + "/workspaces/list",
    workspacesMinList: MICROSERVICE_URL + "/workspaces/min-list",
    workspacesUpdate: MICROSERVICE_URL + "/workspaces/update",
    workspacesInfo: MICROSERVICE_URL + "/workspaces/info",

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
    docsUpdate: MICROSERVICE_URL + "/docs/update",
    docsList: MICROSERVICE_URL + "/docs/list",
    docsStripe: MICROSERVICE_URL + "/docs/stripe",
    docsPrintable: MICROSERVICE_URL + "/docs/printable",
    docsMinList: MICROSERVICE_URL + "/docs/min-list",
    docsInfo: MICROSERVICE_URL + "/docs/info",
    docsDelete: MICROSERVICE_URL + "/docs/delete",
    docsMove: MICROSERVICE_URL + "/docs/move",
    docsCopy: MICROSERVICE_URL + "/docs/copy",
    docsExport: MICROSERVICE_URL + "/docs/export",
    docsImport: MICROSERVICE_URL + "/docs/import",
    docsEdit: MICROSERVICE_URL + "/docs/edit",
};


export const MENU_ROUTES = [
    {
        path: "/workspaces",
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
