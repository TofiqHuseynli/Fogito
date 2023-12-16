import React from 'react';
import classNames from 'classnames';
import { Spinner, Lang, useToast } from 'fogito-core-ui';
import { Link } from "react-router-dom";
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Task } from './Task';
import {
    columnDuplicate,
    columnWatch,
    kanbanArchived,
    kanbanDelete,
    statusDefault,
    statusDelete,
    statusEdit,
} from '@actions';

export const Column = React.memo(
    ({
        id,
        title,
        watch,
        leads,
        url,
        index,
        onMove,
        reload,
        selectedLabel,
        onLabel,
        path,
        is_default

    }) => {
        const toast = useToast();
        const [state, setState] = React.useReducer(
            (prevState, newState) => ({ ...prevState, ...newState }),
            {
                defaultStatus: is_default,
                columnLoading: false,
                updated: false,
                column: {
                    editable: false,
                    oldTitle: title,
                    newTitle: title,
                },
            }
        );

        const onTitleUpdate = async () => {
            let response = await statusEdit({
                id,
                title: state.column.newTitle,
            });
            if (response) {
                if (response.status === 'success') {
                    setState({
                        column: {
                            ...state.column,
                            oldTitle: state.column.newTitle,
                            editable: false,
                        },
                    });
                } else {
                    toast.fire({ icon: 'error', title: response.description });
                }
            }
        };


        const onAction = (type, array) =>
            toast
                .fire({
                    position: 'center',
                    toast: false,
                    timer: null,
                    title: Lang.get(
                        type === 'delete' ? 'DeleteAlertTitle' : 'ArchiveAlertTitle'
                    ),
                    text: Lang.get(
                        type === 'delete'
                            ? 'DeleteAlertDescription'
                            : 'ArchiveAlertDescription'
                    ),
                    buttonsStyling: false,
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonClass: 'btn btn-success',
                    cancelButtonClass: 'btn btn-secondary',
                    confirmButtonText: Lang.get('Confirm'),
                    cancelButtonText: Lang.get('Cancel'),
                })
                .then(async (res) => {
                    if (res?.value) {
                        if (array) {
                            array.length && setState({ columnLoading: true });
                            array.forEach(async (id) => {
                                let response =
                                    type === 'delete'
                                        ? await statusDelete({ id })
                                        : await kanbanArchived({ status_id: id, archived: 1 });
                                setState({ columnLoading: false });
                                if (response) {
                                    if (response?.status === 'success') {
                                        reload();
                                    } else {
                                        toast.fire({
                                            title: response.description,
                                            icon: 'error',
                                        });
                                    }
                                }
                            });
                        }
                        else {
                            setState({ columnLoading: true });
                            let response =
                                type === 'delete'
                                    ? await kanbanDelete({ id })
                                    : await kanbanArchived({ status_id: id, archived: 1 });
                            if (response) {
                                setState({ columnLoading: false });
                                if (response?.status === 'success') {
                                    reload();
                                } else {
                                    toast.fire({
                                        title: response.description,
                                        icon: 'error',
                                    });
                                }
                            }
                        }
                    }
                });

        const unArchive = (type, id) =>
            toast
                .fire({
                    position: 'center',
                    toast: false,
                    timer: null,
                    title: Lang.get('UnArchiveAlertTitle'),
                    text: Lang.get('UnArchiveAlertDescription'),
                    buttonsStyling: false,
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonClass: 'btn btn-success',
                    cancelButtonClass: 'btn btn-secondary',
                    confirmButtonText: Lang.get('Confirm'),
                    cancelButtonText: Lang.get('Cancel'),
                })
                .then(async (res) => {
                    if (res?.value) {
                        setState({ columnLoading: true });
                        let response = null;
                        if (type === 'column') {
                            response = await kanbanArchived({ id, type: 'unarchive' });
                        } else {
                            response = await kanbanArchived({ id, type: 'unarchive' });
                        }
                        if (response) {
                            setState({ columnLoading: false });
                            toast.fire({
                                icon: response.status,
                                title: response.description,
                            });
                            if (response.status === 'success') {
                                reload('noload');
                            }
                        }
                    }
                });

        const onDefault = async (type,value) => {
            toast
                .fire({
                    position: 'center',
                    toast: false,
                    timer: null,
                    title: Lang.get(
                        type === 'delete' ? 'DeleteAlertTitle' : 'ArchiveAlertTitle'
                    ),
                    text: Lang.get(
                        type === 'delete'
                            ? 'DeleteAlertDescription'
                            : 'Confirm for default status'
                    ),
                    buttonsStyling: false,
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonClass: 'btn btn-success',
                    cancelButtonClass: 'btn btn-secondary',
                    confirmButtonText: Lang.get('Confirm'),
                    cancelButtonText: Lang.get('Cancel'),
                })
                .then(async (res) => {
                    if (res?.value) {
                        setState({ columnLoading: true });
                        let response = await statusDefault({ id });
                        if (response) {
                            setState({ columnLoading: false });
                            if (response.status === 'success') {
                                setState({ defaultStatus: value });
                                reload();
                            } else {
                                toast.fire({ icon: 'error', title: response.description });
                            }
                        }
                    }



                });

        }

        return (
            <Draggable draggableId={id} index={index}>
                {(provided, snapshot) => (
                    <div
                        className={classNames('column bg-white d-flex flex-column', {
                            dragging: snapshot.isDragging,
                        })}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                    >
                        <div
                            className="head border-bottom border-bottom-secondary d-flex align-items-center p-3"
                            {...provided.dragHandleProps}
                        >
                            {state.defaultStatus ? <div><i className="text-primary feather feather-check-circle mr-2 fs-20"></i></div> : null}
                            {state.column.editable ? (
                                <input
                                    autoFocus
                                    value={state.column.newTitle}
                                    onBlur={() =>
                                        state.column.newTitle !== state.column.oldTitle
                                            ? onTitleUpdate()
                                            : setState({
                                                column: { ...state.column, editable: false },
                                            })
                                    }
                                    onChange={(e) =>
                                        setState({
                                            column: { ...state.column, newTitle: e.target.value },
                                        })
                                    }
                                    className="form-control form-control-sm mr-auto w-auto"
                                />
                            ) : (
                                <h4
                                    className="text-primary text-truncate font-weight-bold d-inline mb-0 mr-auto"
                                    onClick={() =>
                                        setState({ column: { ...state.column, editable: true } })
                                    }
                                >
                                    {state.column.oldTitle}
                                </h4>
                            )}
                            {state.columnLoading && <Spinner color="#4388b9 " />}
                            <div className="dropdown ml-2">
                                <button
                                    data-toggle="dropdown"
                                    className="feather feather-more-horizontal text-primary p-1"
                                />
                                <div className="dropdown-menu dropdown-menu-right m-0 p-0">
                                    <h6 className="dropdown-header font-weight-normal text-capitalize text-primary">
                                        {Lang.get('Actions')}
                                    </h6>
                                    <div className="dropdown-divider m-0" />
                                    {state.defaultStatus
                                        ? <button
                                            className="dropdown-item noDelete"
                                        >
                                            {Lang.get('DeleteThisStatus')}
                                        </button>
                                        :
                                        <button
                                            className="dropdown-item"
                                            onClick={() => onAction('delete')}
                                        >
                                            {Lang.get('DeleteThisStatus')}
                                        </button>}
                                    <button className="dropdown-item"
                                        onClick={() => onAction('column')}>
                                        {Lang.get('ArchiveAllLeadInStatus')}
                                    </button>

                                    <button
                                        className="dropdown-item"
                                        onClick={() => onAction('delete')}
                                    >
                                        {Lang.get('DeleteAllLeadInStatus')}
                                    </button>

                                    {!state.defaultStatus ? <button
                                        className="dropdown-item d-flex align-items-center"
                                        onClick={() => onDefault(!state.defaultStatus)}
                                    >
                                        {Lang.get('MakeDefaultStatus')}
                                        {state.defaultStatus == true && (
                                            <i className="feather feather-check ml-auto mr-0" />
                                        )}
                                    </button> : null}
                                </div>
                            </div>
                        </div>
                        <Droppable droppableId={id} type="task">
                            {(provided) => (
                                <div
                                    className="body p-3"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {leads?.length > 0 ? (
                                        leads.map((item, index) => (
                                            <Task
                                                {...{ ...item, url, index }}
                                                onMove={(data) => onMove(data)}
                                                key={item.id}
                                                reload={reload}
                                                selectedLabel={selectedLabel}
                                                onLabel={onLabel}
                                                path={path}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-center text-muted font-weight-bold mb-0">
                                            {Lang.get('NoTask')}
                                        </p>
                                    )}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                        <div
                            className='footer p-0'
                        >
                            <Link
                                className="d-flex align-items-center justify-content-center font-weight-bold border-0 w-100 h-100 p-3"
                                to={`${path}/${id}/add`}
                            >
                                <i className="feather feather-plus font-weight-bold mr-2" />
                                {Lang.get('NewTask')}
                            </Link>
                        </div>
                    </div>
                )}
            </Draggable>
        );
    }
);
