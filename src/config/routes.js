import { Groups, History, Kanban, Leads, Schedule, Template } from "@layouts";
import React from "react";







export const CORE_API_URL = "/core";
export const MICROSERVICE_URL = "/leads";



export const API_ROUTES = {

    //Users
    usersSearch: MICROSERVICE_URL + "/users/search",



    //Leads groups
    groupsList: MICROSERVICE_URL + "/groups/list",
    groupsCreate: MICROSERVICE_URL + "/groups/add",
    groupsDelete: MICROSERVICE_URL + "/groups/delete",
    groupsUpdate: MICROSERVICE_URL + "/groups/edit",
    groupsInfo: MICROSERVICE_URL + "/groups/info",
    groupsMinList: MICROSERVICE_URL + "/groups/minlist",


    //Leads list
    listList: MICROSERVICE_URL + "/leads/list",
    listCreate: MICROSERVICE_URL + "/leads/add",
    listDelete: MICROSERVICE_URL + "/leads/delete",
    minList: MICROSERVICE_URL + "/leads/minlist",
    infoLead: MICROSERVICE_URL + "/leads/info",
    leadUpdate: MICROSERVICE_URL + "/leads/edit",
    leadArchive: MICROSERVICE_URL + "/leads/archive",
    leadMove: MICROSERVICE_URL + "/leads/move",


    //History
    historyList: MICROSERVICE_URL + "/history/list",
    historyEmailtotal: MICROSERVICE_URL + "/history/emailtotal",

    //Template
    templateList: MICROSERVICE_URL + "/templates/list",
    templateMinList: MICROSERVICE_URL + "/templates/minlist",

    //Schedule
    scheduleList: MICROSERVICE_URL + "/schedules/list",
    infoSchedule: MICROSERVICE_URL + "/schedules/info",
    scheduleCreate: MICROSERVICE_URL + "/schedules/add",
    scheduleEdit: MICROSERVICE_URL + "/schedules/edit",
    scheduleDelete: MICROSERVICE_URL + "/schedules/delete",
    scheduleArchive: MICROSERVICE_URL + "/schedules/archive",

    //Kanban
    kanbanList: MICROSERVICE_URL + "/kanban/list",
    kanbanDelete: MICROSERVICE_URL + "/kanban/delete",
    kanbanArchived: MICROSERVICE_URL + "/kanban/archive",




    //Status
    statusMinList: MICROSERVICE_URL + "/statuses/minlist",
    statusCreate: MICROSERVICE_URL + "/statuses/add",
    statusEdit: MICROSERVICE_URL + "/statuses/edit",
    statusDelete: MICROSERVICE_URL + "/statuses/delete",
    statusMove: MICROSERVICE_URL + "/statuses/move",
    statusDefault: MICROSERVICE_URL + "/statuses/default",

    // Data
    snippetsParameter: MICROSERVICE_URL + "/data/parameter",



    // Settings
    settings: CORE_API_URL + "/settings",
    translations: CORE_API_URL + "/settings/translations",
    timezones: CORE_API_URL + "/data/timezones",
};




export const MENU_ROUTES = [

   
            {
                path: "/groups",
                name: "Groups",
                icon: <i className="symbol feather feather-users text-danger" />,
            
                component: (props) => <Groups {...props} />,
            },
            {
                path: "/list",
                name: "Lead List",
                icon: <i className="symbol feather feather-list text-primary" />,
            
                component: (props) => <Leads {...props} />,
            },
            {
                path: "/kanban",
                name: "Kanban",
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="symbol text-warning"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><rect x="7" y="7" width="3" height="9"></rect><rect x="14" y="7" width="3" height="5"></rect></svg>,
               
                component: (props) => <Kanban {...props} />,
            },
        
    



    {
        path: "/groups/:id?/:docs_id?",
        name: "Docs Panel",
        isExact: true,
        isHidden: true,
        component: (props) => <Docs {...props} />,
    },

        {
            path: "/history",
            name: "History",
            icon: <i className="symbol feather feather-archive text-danger" />, 
            component: (props) => <History {...props} />,
        },
        {
            path: "/templates",
            name: "Template",
            icon: <i className="symbol feather feather-calendar text-success" />,
            component: (props) => <Template {...props} />,
        },
        {
            path: "/schedule",
            name: "Schedule",
            icon: <i className="symbol feather feather-activity text-primary" />,
            component: (props) => <Schedule {...props} />,
        },
   

    // {
    //     path: "/groups/:id?/:docs_id?",
    //     name: "Groups Panel",
    //     isExact: true,
    //     isHidden: true,
    //     component: (props) => <Docs {...props} />,
    // },


];
