import React from 'react'

import {
    AppContext,
    ErrorBoundary,
    useToast,
} from "fogito-core-ui";
import {AlertLib} from "@plugins";
import { listDelete, listList, getFilterToLocal, groupsMinList, onFilterStorageBySection } from "@actions";
import { HeaderCustom, ViewRoutes, TableLead, Filters } from './components'; 
import moment from "moment";
 

export const Leads = ({ name, history, match: { path, url } }) => {

    const toast = useToast();
    const VIEW = "lead";

    const { setProps } = React.useContext(AppContext);

    const [state, setState] = React.useReducer(
        (prevState, newState) => ({ ...prevState, ...newState }),
        {
            loading: true,
            data: [],
            count: 0,
            skip: 0,
            limit: localStorage.getItem(`${VIEW}_tb_limit`) || 10,
            status: 0,
            selectedIDs: [],
            hiddenColumns: [],
            sort: "created_at",
            sort_type: "desc",
            filter:false,
            statuses: [],
            group:[],
            filters: { 
                range: {
                  start: getFilterToLocal(name, "date")
                    ? moment
                        .unix(getFilterToLocal(name, "date")?.split("T")[0] || "")
                        .format("YYYY-MM-DD")
                    : null,
                  end: getFilterToLocal(name, "date")
                    ? moment
                        .unix(getFilterToLocal(name, "date")?.split("T")[1] || "")
                        .format("YYYY-MM-DD")
                    : null,
                },  
                receiver_type: getFilterToLocal(name, "receiver_type") || null,
                archived: getFilterToLocal(name, "archived") || null,
                group: getFilterToLocal(name, "group") || null,
              },
           
            
        }

    );

    const loadData = async (params) => {
        setState({ loading: true, skip: params?.skip || 0 });
        let groupRes = await loadGroup();
        let response = await listList({
            ...state.filters,
            ...state.filters.range,
            status: state.status?.value || "",
            skip: params?.skip || 0,
            limit: state.limit || "",
            sort: state.sort || "",
            sort_type: state.sort_type || "",
        });
        if (response) {
            setState({ loading: false });
            setState({group: groupRes})
            if (response.status === "success") {
                setState({ data: response.data, count: response.count })
            }
            else {
                setState({ data: [], count: 0 });
            }

        }
    };
 

    const loadGroup = async (title = '') => {
        let response = await groupsMinList({
            title,
            skip: 0,
            limit: 20,
        });
        if (response?.status === "success") {
            return response.data;
        } else {
            toast.fire({ icon: response?.status, title: response.description });
        }
        return [];
    };
 

    const onDelete = async () => {
        let confirmed = await AlertLib.deleteCondition()
        if (!confirmed) return;
        let count = 1;
        let total = state.selectedIDs.length;
        setState({ loading: true });
        for (const id of state.selectedIDs) {
            let response = await listDelete({ id });
            if (response?.status === "success") {
                if (count >= total) {
                    setState({ loading: false, selectedIDs: [] });
                    toast.fire({
                        title: response.description,
                        icon: "success",
                    });
                    await loadData();
                }
                count++;
            } else {
                setState({ loading: false });
                toast.fire({
                    title: response.description,
                    icon: "error",
                });
            }
        }
    };

    const onClearFilters = async () => { 
        setState({filters:{
            range: {  start: null,  end:  null, },  
            receiver_type: null,
            archived:  null,
            group:   null,
        }})
        onFilterStorageBySection(name);
    };

    React.useEffect(() => {
        loadData();
    }, [ state.limit, state.filters, state.sort, state.sort_type, state.status, state.title]);


    React.useEffect(() => {
        setProps({ activeRoute: { name, path } });
        return () => {
            setProps({ activeRoute: { name: null, path: null }});
        };

    }, []);

    const filters = {  
        range:
        (state.filters.range.start === null &&  state.filters.range.end === null) ||
        (state.filters.range.start === "" && state.filters.range.end === "")  ? null  : state.filters.range,

        receiver_type: state.filters.receiver_type === "" ? null : state.filters.receiver_type,
        archived: state.filters.archived === "" ? null : state.filters.archived,
        group: state.filters.group === "" ? null : state.filters.group
      }; 

      
    return (
        <ErrorBoundary>
            <Filters
                show={state.filter}
                name={name} 
                filters={state.filters}
                state={state}
                setState={(key, value) => setState({ [key]: value })}
            />
 
            <ViewRoutes
                onClose={() => history.push(url)}
                loadData={loadData}
                path={path}
            />

            <HeaderCustom
                state={state}
                setState={setState}
                onDelete={onDelete}
                loadData={loadData}
                onClearFilters={onClearFilters}
                path={path}
                VIEW={VIEW}
                filters={filters}
            />

            <section className="container-fluid">

                <TableLead
                    state={state}
                    setState={setState}
                    path={path}
                    loadData={loadData}
                    VIEW={VIEW}
                />

            </section>


        </ErrorBoundary>
    )
}