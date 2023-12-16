import React from 'react'
import {
    AppContext,
    ErrorBoundary,
    useToast,
} from "fogito-core-ui";
import {HeaderCustom, TableCustom, ViewRoutes} from "./components";
import {AlertLib} from "@plugins";
import {workspacesDelete, workspacesList} from "@actions";

export const Workspaces = React.memo(({name, history, match: {path, url}}) => {

    const {setProps} = React.useContext(AppContext);

    const toast = useToast();

    const [state, setState] = React.useReducer(
        (prevState, newState) => ({...prevState, ...newState}),
        {
            loading: false,
            data: [],
            count: 0,
            skip: 0,
            limit: 10,
            title: "",
            status: 0,
            selectedIDs: [],
            hiddenColumns: [],
            sort: "created_at",
            sort_type: "desc",
        }
    );


    const loadData = async (params) => {
        setState({ loading: true, skip: params?.skip || 0 });
        let response = await workspacesList({
            skip: params?.skip || 0,
            limit: state.limit || "",
            sort: state.sort || "",
            sort_type: state.sort_type || "",
            title: state?.title || "",
            status: state.status?.value || "",
        });
        if (response) {
            setState({ loading: false });
            if (response.status === "success") {
                setState({ data: response.data, count: response.count });
            } else {
                setState({ data: [], count: 0 });
            }
        }
    };


    const onDelete = async () => {
        let confirmed = await AlertLib.deleteCondition()
        if (!confirmed) return;
        let count = 1;
        let total = state.selectedIDs.length;
        setState({ loading: true });
        for (const id of state.selectedIDs) {
            let response = await workspacesDelete({ id });
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


    React.useEffect(() => {
        loadData();
    }, [state.limit, state.sort, state.sort_type, state.status,state.title]);


    React.useEffect(() => {
        window.scrollTo(0, 0);
        setProps({activeRoute: {name, path}});

        return () => {
            setProps({activeRoute: {name: null, path: null}});
        };
    }, []);



    return (
        <ErrorBoundary>

            <ViewRoutes
                onClose={()=>history.push(url)}
                loadData={loadData}
                path={path}
            />

            <HeaderCustom
                state={state}
                setState={setState}
                onDelete={onDelete}
                loadData={loadData}
                path={path}
            />

            <section className="container-fluid">

                <TableCustom
                    state={state}
                    setState={setState}
                    path={path}
                    loadData={loadData}
                />

            </section>
        </ErrorBoundary>
    );
});
