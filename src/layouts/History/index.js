import React from 'react'

import {
    AppContext,
    ErrorBoundary,
    useToast,
} from "fogito-core-ui";
import { getFilterToLocal, historyDelete, historyEmailtotal, historyList } from "@actions";
import { HeaderHistory } from './components/HeaderHistory';
import { TableHistory } from './components/TableHistory';
import { CardList } from './components/CardList';
import Item from 'antd/lib/list/Item';




export const History = ({ name, history, match: { path, url } }) => {

    const toast = useToast();

    const { setProps } = React.useContext(AppContext);

    const [state, setState] = React.useReducer(
        (prevState, newState) => ({ ...prevState, ...newState }),
        {
            loading: true,
            data: [],
            count: 0,
            skip: 0,
            limit: 10,
            status: 0,
            selectedIDs: [],
            hiddenColumns: [],
            sort: "created_at",
            sort_type: "desc",
            emailTotal:null,
            filters: {
                opened: 0,
                delivered: 0,
                not_delivered: 0,
                activeCard: getFilterToLocal(name, "status") || "0",

            }
        }

    );


    const loadData = async (params) => {
        setState({ loading: true });
      
        let response = await historyList({
            ...state.filters,
            email: state.email,
            status: state.status?.value || "",
            skip: params?.skip || 0,
            limit: state.limit || "",
            sort: state.sort || "",
            sort_type: state.sort_type || "",

        });
        if (response) {
            setState({ loading: false });
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

    React.useEffect(() => {
        loadData();
    }, [state.title, state.status, state.filters]);


    React.useEffect(() => {
        setProps({ activeRoute: { name, path } });
        return () => {
            setProps({ activeRoute: { name: null, path: null } });
        };

    }, []);

    const filters = {
        ...state.filters,
        activeCard:
            state.filters.activeCard === "0" ? null : state.filters.activeCard,
    };

    return (
        <ErrorBoundary>


            {/* < ViewRoutes
            onClose={() => history.push(url)}
            loadData={loadData}
            path={path}
        /> */}

            <HeaderHistory
                state={state}
                setState={setState}
                onDelete={onDelete}
                loadData={loadData}
                path={path}
            />

            <section className="container-fluid">
                <CardList state={state} setState={setState} />

                <TableHistory
                    state={state}
                    setState={setState}
                    path={path}
                    loadData={loadData}
                />

            </section>

        </ErrorBoundary>
    )
}