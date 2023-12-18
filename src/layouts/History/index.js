import React from 'react'

import {
    AppContext,
    ErrorBoundary,
    useToast,
} from "fogito-core-ui";
import { getFilterToLocal, historyDelete,  historyList, onFilterStorageBySection, templateMinList } from "@actions";
import { CardList, HeaderHistory, TableHistory, Filters } from './components';
import moment from "moment";
import { config } from "@config";

export const History = ({ name, match: { path } }) => {

    const toast = useToast();
    const VIEW = "history";
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
            filter: false,
            selectedIDs: [],
            hiddenColumns: JSON.parse(
                localStorage.getItem(`${VIEW}_columns_${config.appID}`)
              ) || [0, 3, 6],
            sort: "created_at",
            sort_type: "desc",
            emailTotal:null,
            member: getFilterToLocal(name, "member") || null,
            template: [],
            title: getFilterToLocal(name, "title") || null,
            filters: {
                opened: 0,
                delivered: 0,
                not_delivered: 0,
                activeCard: getFilterToLocal(name, "status") || "0",
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
                archived: getFilterToLocal(name, "type") || null,
                target_type:  getFilterToLocal(name, "target") || null,
                template_id: getFilterToLocal(name, "template") || null,
            }
        }
    );

    const loadData = async (params) => {
        setState({ loading: true, skip: params?.skip || 0 });
        let templateRes = await loadTemplate();
        let response = await historyList({
            ...state.filters,
            email: state.email,
            status: state.status?.value || "",
            skip: params?.skip || 0,
            limit: state.limit || "",
            sort: state.sort || "",
            sort_type: state.sort_type || "",
            member_id: state.member?.value || "",
            title: state.title || ""
        });
        if (response) {
            setState({ loading: false, template: templateRes });
            if (response.status === "success") {
                setState({
                    data: response.data, count: response.count,
                    
                })
            }
            else {
                setState({ data: [], count: 0 });
            }
        }
    };

    console.log(state.emailTotal)
    const onDelete = async () => {
        let confirmed = await AlertLib.deleteCondition()
        if (!confirmed) return;
        let count = 1;
        let total = state.selectedIDs.length;
        setState({ loading: true });
        for (const id of state.selectedIDs) {
            let response = await historyDelete({ id });
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

    
    const onClearFilters = async () => {
        setState({
            title: null,
            member: null,
            filters: {
                range: { start: null, end: null, },
                archived: null,
                target_type: null,
                template_id: null
            }
        })
        onFilterStorageBySection(name);
    };

    const filters = {
        range:
            (state.filters.range.start === null && state.filters.range.end === null) ||
            (state.filters.range.start === "" && state.filters.range.end === "") ? null : state.filters.range,
            title: state.title === "" ? null : state.title,
            member: state.member ==="" ? null : state.member,
        archived: state.filters.archived === "" ? null : state.filters.archived,
        target_type: state.filters.target_type === "" ? null : state.filters.target_type,
        template_id: state.filters.template_id === "" ? null : state.filters.template_id

    };

    React.useEffect(() => {
        loadData();
    }, [state.title, state.status, state.filters, state.limit, state.member]);


    React.useEffect(() => {
        setProps({ activeRoute: { name, path } });
        return () => {
            setProps({ activeRoute: { name: null, path: null } });
        };

    }, []);

    return (
        <ErrorBoundary>
            {/* < ViewRoutes
            onClose={() => history.push(url)}
            loadData={loadData}
            path={path}
        /> */}
        <Filters
                show={state.filter}
                name={name}
                filters={state.filters}
                state={state}
                setState={(key, value) => setState({ [key]: value })}
            />

            <HeaderHistory
                state={state}
                setState={setState}
                onDelete={onDelete}
                loadData={loadData}
                path={path}
                name={name}
                onClearFilters={onClearFilters}
                filters={filters}
                VIEW={VIEW}
            />

            <section className="container-fluid">
                <CardList 
                state={state} 
                setState={setState} 
                name={name}
                />

                <TableHistory
                    VIEW={VIEW}
                    state={state}
                    setState={setState}
                    path={path}
                    loadData={loadData}
                />

            </section>

        </ErrorBoundary>
    )
}