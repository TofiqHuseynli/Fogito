import React from 'react'

import {
    AppContext,
    ErrorBoundary,
    useToast,
} from "fogito-core-ui";
import {
    scheduleList, scheduleDelete, getFilterToLocal, onFilterStorageBySection,
    groupsMinList, templateMinList, usersSearch
} from "@actions";
import { Filters, HeaderSchedule, TableSchedule, ViewRoutes } from './components';


export const Schedule = ({ name, history, match: { path, url } }) => {

    const toast = useToast();
    const VIEW = "invoices";

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
            filter: false,
            email: "",
            group: [],
            template: [],
            member: getFilterToLocal(name, "member") || null,
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
                archived: getFilterToLocal(name, "archived") || null,
                target_type: getFilterToLocal(name, "target_type") || null,
                group: getFilterToLocal(name, "group") || null,
                template_id: getFilterToLocal(name, "template") || null,

            },
        }

    );


    const loadData = async (params) => {
        setState({ loading: true, skip: params?.skip || 0 });
        let groupRes = await loadGroup();
        let templateRes = await loadTemplate();
        let response = await scheduleList({
            ...state.filters,
            ...state.filters.range,
            status: state.status?.value || "",
            member_id: state.member?.value || "",
            skip: params?.skip || 0,
            limit: state.limit || "",
            sort: state.sort || "",
            sort_type: state.sort_type || "",

        });
        if (response) {
            setState({ loading: false });
            setState({ group: groupRes });
            setState({ template: templateRes });
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

    const loadTemplate = async (title = '') => {
        let response = await templateMinList({
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

    const loadUsers = async (query) => {
        let response = await usersSearch({
          skip: 0,
          limit: 20,
          query,
          type: "members",
          member_id: getFilterToLocal(name, "member") || "",
        });
        if (response?.status === "success") {
          if (response.selected) {
            setState({ member: response.selected });
          }
          return response.data?.map((item) => ({
            value: item.id,
            label: item.fullname,
          }));
        }
      };


    const onDelete = async () => {
        let confirmed = await AlertLib.deleteCondition()
        if (!confirmed) return;

        let count = 1;
        let total = state.selectedIDs.length;
        setState({ loading: true });
        for (const id of state.selectedIDs) {
            let response = await scheduleDelete({ id });
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
    }

    const onClearFilters = async () => {
        setState({
            filters: {
                range: { start: null, end: null, },
                archived: null,
                target_type: null,
                group: null,
                template_id: null

            }
        })
        onFilterStorageBySection(name);
    };

    React.useEffect(() => {
        loadData();
    }, [state.limit, state.title, state.filters, state.sort, state.sort_type, state.status, state.title, state.member]);


    React.useEffect(() => {
        setProps({ activeRoute: { name, path } });
        return () => {
            setProps({ activeRoute: { name: null, path: null } });
        };

    }, []);

    const filters = {
        range:
            (state.filters.range.start === null && state.filters.range.end === null) ||
            (state.filters.range.start === "" && state.filters.range.end === "") ? null : state.filters.range,

        archived: state.filters.archived === "" ? null : state.filters.archived,
        target_type: state.filters.target_type === "" ? null : state.filters.target_type,
        group: state.filters.group === "" ? null : state.filters.group,
        template_id: state.filters.template_id === "" ? null : state.filters.template_id

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



            < ViewRoutes
            onClose={() => history.push(url)}
            loadData={loadData}
            path={path}
        />

            <HeaderSchedule
                state={state}
                setState={setState}
                onDelete={onDelete}
                loadData={loadData}
                path={path}
                onClearFilters={onClearFilters}
                VIEW={VIEW}
                filters={filters}
                loadUsers={loadUsers}
            />

            <section className="container-fluid">

                <TableSchedule
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