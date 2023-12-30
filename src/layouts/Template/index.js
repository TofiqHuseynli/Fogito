import React from "react";

import { AppContext, ErrorBoundary, useToast } from "fogito-core-ui";
import {
  getFilterToLocal,
  templateDelete,
  templateList,
  onFilterStorageBySection,
} from "@actions";
import { config } from "@config";
import {
  Filters,
  HeaderTemplate,
  TableTemplate,
  ViewRoutes,
} from "./components";
import moment from "moment";

export const Template = ({ name, history, match: { path, url } }) => {
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
      status: 0,
      title: getFilterToLocal(name, "title") || null,
      selectedIDs: [],
      hiddenColumns: JSON.parse(
        localStorage.getItem(`${VIEW}_columns_${config.appID}`)
      ) || [0, 3, 6],
      sort: "created_at",
      sort_type: "desc",
      filter: false,
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
      },
    }
  );

  const loadData = async (params) => {
    setState({ loading: true });
    let response = await templateList({
      ...state.filters,
      ...state.filters.range,
      status: state.status?.value || "",
      skip: params?.skip || 0,
      limit: state.limit || "",
      title: state.title || "",
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
      let response = await templateDelete({ id });
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
      title: null,
      filters: {
        range: { start: null, end: null },
        archived: null,
        target_type: null,
        group: null,
        template_id: null,
      },
    });
    onFilterStorageBySection(name);
  };

  const filters = {
    title: state.title === "" ? null : state.title,
    range:
      (state.filters.range.start === null &&
        state.filters.range.end === null) ||
      (state.filters.range.start === "" && state.filters.range.end === "")
        ? null
        : state.filters.range,
    archived: state.filters.archived === "" ? null : state.filters.archived,
  };

  React.useEffect(() => {
    loadData();
  }, [state.title, state.status, state.filters]);

  React.useEffect(() => {
    setProps({ activeRoute: { name, path } });
    return () => {
      setProps({ activeRoute: { name: null, path: null } });
    };
  }, []);

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

      <HeaderTemplate
        state={state}
        setState={setState}
        onDelete={onDelete}
        loadData={loadData}
        path={path}
        name={name}
        VIEW={VIEW}
        onClearFilters={onClearFilters}
        filters={filters}
      />

      <section className="container-fluid">
        <TableTemplate
          state={state}
          setState={setState}
          path={path}
          loadData={loadData}
        />
      </section>
    </ErrorBoundary>
  );
};
