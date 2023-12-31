import React from "react";

import { AppContext, ErrorBoundary, useToast } from "fogito-core-ui";
import { getFilterToLocal, groupsDelete, groupsList } from "@actions";
import { HeaderGroups } from "./components/HeaderGroups";
import { TableGroups } from "./components/TableGroups";
import { ViewRoutes } from "./components/ViewRoutes";
import moment from "moment";
import { config } from "@config";

export const Groups = ({ name, history, match: { path, url } }) => {
  const toast = useToast();
  const VIEW = "Template";

  const { setProps } = React.useContext(AppContext);

  const [state, setState] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    {
      loading: true,
      data: [],
      count: 0,
      skip: 0,
      limit: 10,
      title: "",
      status: 0,
      selectedIDs: [],
      hiddenColumns: JSON.parse(
        localStorage.getItem(`${VIEW}_columns_${config.appID}`)
      ) || [0, 3, 6],
      sort: "created_at",
      sort_type: "desc",
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
    }
  );

  const loadData = async (params) => {
    setState({ loading: true });
    let response = await groupsList({
      ...state.range,
      title: state?.title || "",
      status: state.status?.value || "",
      skip: params?.skip || 0,
      limit: state.limit || "",
      sort: state.sort || "",
      sort_type: state.sort_type || "",
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
    let confirmed = await AlertLib.deleteCondition();
    if (!confirmed) return;

    let count = 1;
    let total = state.selectedIDs.length;
    setState({ loading: true });
    for (const id of state.selectedIDs) {
      let response = await groupsDelete({ id });
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

  React.useEffect(() => {
    loadData();
  }, [state.title, state.status, state.range]);

  React.useEffect(() => {
    setProps({ activeRoute: { name, path } });
    return () => {
      setProps({ activeRoute: { name: null, path: null } });
    };
  }, []);

  return (
    <ErrorBoundary>
      <ViewRoutes
        onClose={() => history.push(url)}
        loadData={loadData}
        path={path}
      />

      <HeaderGroups
        state={state}
        setState={setState}
        onDelete={onDelete}
        loadData={loadData}
        path={path}
        name={name}
        VIEW={VIEW}
      />

      <section className="container-fluid">
        <TableGroups
          state={state}
          setState={setState}
          path={path}
          loadData={loadData}
        />
      </section>
    </ErrorBoundary>
  );
};
