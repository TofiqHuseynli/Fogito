import React from 'react'

import {
    AppContext,
    ErrorBoundary,
    useToast,
    App,
    useModal,
    Auth,
    Popup,
    Lang,
} from "fogito-core-ui";
import { AlertLib } from "@plugins";
import {
    listDelete, listList, getFilterToLocal, groupsMinList,
    onFilterStorageBySection, kanbanList, statusMove, leadMove
} from "@actions";
import { HeaderCustom, Filters, ProjectsLoadingSection } from './components';
import moment from "moment";
import { AddStatus, Move } from "./forms";
import { Add } from "../Leads/views/Add";
import { Edit } from "../Leads/views/Edit";
import { Route } from "react-router-dom";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Column } from "./components";
import {
    taskMove,
} from "@actions";
import { ProjectsLoading } from './components/ProjectsLoading';




export const Kanban = ({ name, history, match: { path, url, params: { id }, } }) => {

    const toast = useToast();
    const modal = useModal();
    const PROJECT = App.get("PROJECT");
    const { setProps } = React.useContext(AppContext);
    const [state, setState] = React.useReducer(
        (prevState, newState) => ({ ...prevState, ...newState }),
        {
            loading: true,
            headerLoading: true,
            data: [],
            labels: [],
            fullname: getFilterToLocal(name, "title") || "",
            archived: getFilterToLocal(name, "archived") || null,
            board_id: null,
            selectedLabel: localStorage.getItem("label") === "true",
            selectedUser: null,
            selectedData: null,
            columns: [],
            filtersCount: 0,
            range: {
                start: null,
                end: null,
            },
            count: 0,
            skip: 0,
            limit: localStorage.getItem(`${VIEW}_tb_limit`) || 10,
            status: 0,
            selectedIDs: [],
            hiddenColumns: [],
            sort: "created_at",
            sort_type: "desc",
            filter: false,
            statuses: [],
            group: [],
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

                group: getFilterToLocal(name, "group") || null,
            },


        }

    );

    const loadData = async (params) => {
        setState({ loading: true, skip: params?.skip || 0 });
        // let groupRes = await loadGroup();
        let response = await kanbanList({
            ...state.filters,
            ...state.filters.range,
            fullname: state.fullname,
            status: state.status?.value || "",
            skip: params?.skip || 0,
            archived: state.archived?.value || "",
            limit: state.limit || "",
            sort: state.sort || "",
            sort_type: state.sort_type || "",
            id,
            robot: state.filters.robot?.value || "",
            completed: state.filters.status?.value || "",
            label: state.filters.label?.value || "",
            branch: state.filters.branch?.value || "",
            priority: state.filters.priority || [0, 10],
            title: state.filters.title,
            ...(PROJECT && { from: "project" }),
            start: state.range.start
                ? moment(`${state.range.start} 00:00:00`).unix()
                : "",
            end: state.range.end
                ? moment(`${state.range.end} 23:59:59`).unix()
                : "",
            ...params,
        });
        if (response) {
            let allLeads = response.data?.leads;

            // setState({ group: groupRes })
            if (response.status === "success") {

                setState({
                    loading: false,
                    headerLoading: true,
                    data: response.data, count: response.count,
                    columns: response.data?.statuses.map((column) => {
                        column.leads = [];
                        for (let lead of allLeads) {
                            if (lead.status_id === column.id) {
                                column.leads = column.leads.concat([lead]);
                                //For search optimization
                                allLeads = allLeads.filter((row) => row.id !== lead.id);
                            }
                        }
                        return column;
                    }),
                });
            }
            else {
                toast.fire({ icon: "error", title: response.description });
                history.push(fromPath);
            }

        }
    };



    const onReorder = async ({
        draggableId,
        type,
        source,
        destination,
        remote = true,
    }) => {
        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        let response = null;
        let oldColumns = state.columns;

        if (type === "task") {
            let columnFrom = state.columns.find(
                (item) => item.id === source.droppableId
            );
            let columnTo = state.columns.find(
                (item) => item.id === destination.droppableId
            );

            if (columnFrom === columnTo) {
                let sorted = Array.from(columnFrom.leads);
                let [lead] = sorted.splice(source.index, 1);
                sorted.splice(destination.index, 0, lead);
                setState({
                    columns: state.columns?.map((item) => {
                        if (item.id === columnFrom.id) {
                            item.leads = sorted;
                        }
                        return item;
                    }),
                });
            } else {
                let sortedFrom = Array.from(columnFrom.leads);
                let sortedTo = Array.from(columnTo.leads);
                let [lead] = sortedFrom.splice(source.index, 1);
                lead.column = columnTo.id;
                sortedTo.splice(destination.index, 0, lead);
                setState({
                    columns: state.columns?.map((item) => {
                        if (item.id === columnFrom.id) {
                            item.leads = sortedFrom;
                        }
                        if (item.id === columnTo.id) {
                            item.leads = sortedTo;
                        }
                        return item;
                    }),
                });
            }
            if (remote) {
                response = await leadMove({
                    lead_id: draggableId,
                    status_id: destination.droppableId,
                    position: destination.index + 1,
                });
            }
        } else {
            let sorted = Array.from(state.columns);
            let [column] = sorted.splice(source.index, 1);
            sorted.splice(destination.index, 0, column);
            setState({ columns: sorted });
            if (remote) {
                response = await statusMove({
                    status_id: draggableId,
                    position: destination.index + 1,
                });
            }
        }
        if (response) {
            if (response.status === "error") {
                setState({ columns: oldColumns });
                toast.fire({ icon: "error", title: response.description });
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
        setState({
            archived: null,
            fullname: null,

            filters: {
                range: { start: null, end: null, },
                receiver_type: null,
                group: null,
            },
        })
        onFilterStorageBySection(name);
    };

    React.useEffect(() => {
        loadData();
    }, [id, state.limit, state.filters, state.sort, state.sort_type, state.status, state.title, state.archived]);


    React.useEffect(() => {
        setProps({ activeRoute: { name, path } });
        return () => {
            setProps({ activeRoute: { name: null, path: null } });
        };

    }, [id]);

    const filters = {
        range:
            (state.filters.range.start === null && state.filters.range.end === null) ||
                (state.filters.range.start === "" && state.filters.range.end === "") ? null : state.filters.range,

        receiver_type: state.filters.receiver_type === "" ? null : state.filters.receiver_type,

        archived: state.archived ? state.archived : null,

        group: state.filters.group === "" ? null : state.filters.group,

        fullname: state.fullname ? state.fullname : null
    };



    if (state.loading && state.headerLoading) {
        return <ProjectsLoading state={state} />;
    }
    return (
        <ErrorBoundary>

            {/* Modals */}
            <Popup
                show={modal.modals.includes("add")}
                title={Lang.get("NewList")}
                onClose={() => modal.hide("add")}
            >
                <AddStatus
                    {...state.board}
                    reload={(data) => {
                        setState({
                            columns: state.columns.concat([{ ...data, cards: [] }]),
                        });
                        window.scrollTo({
                            behavior: "smooth",
                            left: document.body.scrollWidth,
                            top: 0,
                        });
                    }}
                    onClose={() => modal.hide("add")}

                />
            </Popup>
            <Popup
                show={modal.modals.includes("move")}
                title={Lang.get("Move")}
                onClose={() => modal.hide("move")}
            >
                <Move
                    {...{ data: state.selectedData, board: state.board }}
                    onClose={() => {
                        setState({ selectedData: null });
                        modal.hide("move");
                    }}
                    reload={loadData}
                />
            </Popup>
            <Route
                path={`${path}/:id/add`}
                render={(routeProps) => (
                    <Add
                        {...routeProps}
                        reload={() => loadData()}
                        onClose={() => history.push(url)}
                    />
                )}
            />

            <Route
                path={`${path}/edit/:id`}
                render={(routeProps) => (
                    <Edit
                        {...routeProps}
                        reload={() => loadData()}
                        onClose={() => history.push(url)}
                    />
                )}
            />



            <Filters
                show={state.filter}
                name={name}
                filters={state.filters}
                state={state}
                setState={(key, value) => setState({ [key]: value })}
            />


            <section
                ref={(el) => {
                    if (el) {
                        el.style.paddingTop = `${el.firstChild.offsetHeight}px`;
                    }
                }}
                className="board"
            >

                <HeaderCustom
                    state={state}
                    setState={setState}
                    onDelete={onDelete}
                    reload={loadData}
                    onClearFilters={onClearFilters}
                    path={path}
                    VIEW={VIEW}
                    onShow={() => modal.show("add")}
                    filterList={filters}
                    filters={filters}
                    name={name}
                />

                {!state.headerLoading ? <ProjectsLoadingSection state={state} /> :
                    <div className="container-fluid position-relative h-100">
                        <DragDropContext onDragEnd={onReorder}>
                            <Droppable
                                droppableId="columns"
                                direction="horizontal"
                                type="column"
                            >
                                {(provided) => (
                                    <div
                                        className="d-flex align-items-start h-100"
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        {state.columns.length > 0 ? (
                                            state.columns?.map((item, index) => (
                                                <Column
                                                    {...{ ...item, url, index }}
                                                    onMove={(selectedData) => {
                                                        setState({ selectedData });
                                                        modal.show("move");
                                                    }}
                                                    reload={loadData}
                                                    key={item.id}
                                                    selectedLabel={state.selectedLabel}
                                                    onLabel={() => {
                                                        setState({ selectedLabel: !state.selectedLabel });
                                                        localStorage.setItem(
                                                            "label",
                                                            !state.selectedLabel
                                                        );
                                                    }}
                                                    path={path}

                                                />
                                            ))
                                        ) : (
                                            <div className="d-flex flex-column align-items-center m-auto">
                                                <h3>No Data</h3>
                                                <p className="text-muted font-weight-bold mt-3">
                                                    {Lang.get("NoList")}
                                                </p>
                                                <button
                                                    className="btn btn-block btn-secondary d-flex align-items-center justify-content-center"
                                                    onClick={() => modal.show("add")}
                                                >
                                                    <i className="feather feather-plus mr-2" />
                                                    {Lang.get("NewList")}
                                                </button>
                                            </div>
                                        )}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>}




            </section>


        </ErrorBoundary>
    )
}