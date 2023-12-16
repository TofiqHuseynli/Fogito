import React from "react";
import { ErrorBoundary, Loading, Lang, useToast } from "fogito-core-ui";
import { boardMinList, columnMinList, columnMove, taskMove } from "@actions";
import AsyncSelect from "react-select/async";

export const Move = React.memo(({ data, board, reload, onClose }) => {
  const toast = useToast();
  const [state, setState] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    {
      loading: false,
      boards: [],
      columns: [],
      count: 0,
      params: {
        id: data?.id,
        board: {
          label: board.title,
          value: board.id,
        },
        position: data?.index + 1,
        ...(data?.type === "task" && { column: data?.column }),
      },
    }
  );

  const loadBoards = async () => {
    setState({ loading: true });
    let response = await boardMinList({ archived: 0 });
    if (response) {
      setState({ loading: false });
      if (response.status === "success") {
        setState({ boards: response.data });
        if (data?.type === "column") {
          setState({
            count: response.data?.find(
              (item) => item.id === state.params.board?.value
            )?.columns_count,
          });
        }
        return response.data?.map((item) => ({
          value: item.id,
          label: item.title,
        }));
      }
    }
  };

  const loadColumns = async (board = "") => {
    setState({ loading: true });
    let response = await columnMinList({
      board: board?.value || "",
      archived: 0,
    });
    if (response) {
      setState({ loading: false });
      if (response.status === "success") {
        let column =
          state.params.board?.value !== state.board?.id
            ? response.data[0]?.id
            : data.column;
        setState({
          params: { ...state.params, column, board },
          columns: response.data,
          count: response.data?.length,
          // count: response.data?.find((item) => item.id === column)?.cards_count,
        });
      }
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setState({ loading: true });
    let response = null;
    if (data?.type === "task") {
      response = await taskMove({
        ...state.params,
        board: state.params.board?.value || "",
      });
    } else {
      response = await columnMove({
        ...state.params,
        board: state.params.board?.value || "",
      });
    }
    if (response) {
      setState({ loading: false });
      if (response.status === "success") {
        await reload({
          id: data?.id,
          type: data?.type,
          source: {
            droppableId: data?.type === "task" ? data?.column : "columns",
            index: data?.index,
          },
          destination: {
            droppableId:
              data?.type === "task" ? state.params.column : "columns",
            index: state.params.position - 1,
          },
          board: state.params.board?.value,
        });
        onClose();
      } else {
        toast.fire({ icon: "error", title: response.description });
      }
    }
  };

  React.useEffect(() => {
    setState({ params: { ...state.params, position: 1 } });
  }, [state.params.column]);

  React.useEffect(() => {
    if (data?.type === "task") {
      loadColumns(state.params.board);
    } else {
      setState({ params: { ...state.params, position: 1 } });
    }
  }, [state.params.board]);

  return (
    <ErrorBoundary>
      {state.loading && <Loading />}
      <form className="row" onSubmit={onSubmit}>
        <div className="form-group col-12">
          <label className="form-control-label">{Lang.get("Project")}</label>
          <AsyncSelect
            isClearable
            cacheOptions
            defaultOptions
            value={state.params.board}
            placeholder={Lang.get("Select")}
            maxMenuHeight={150}
            loadOptions={loadBoards}
            onChange={(board) => {
              setState({ params: { ...state.params, board } });
              if (data?.type === "column") {
                loadColumns(board);
              }
            }}
            className="form-control"
          />
        </div>
        {data?.type === "task" && (
          <div className="form-group col-8">
            <label className="form-control-label">{Lang.get("List")}</label>
            <select
              className="custom-select"
              value={state.params.column}
              onChange={(e) =>
                setState({
                  params: { ...state.params, column: e.target.value },
                  count: parseInt(
                    e.target[e.target.selectedIndex].getAttribute(
                      "data-card-count"
                    )
                  ),
                })
              }
            >
              {state.columns.map((item, key) => (
                <option
                  value={item.id}
                  data-card-count={item.cards_count}
                  key={key}
                >
                  {item.title}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="form-group col">
          <label className="form-control-label">{Lang.get("Position")}</label>
          <select
            className="custom-select"
            value={state.params.position}
            onChange={(e) =>
              setState({
                params: { ...state.params, position: parseInt(e.target.value) },
              })
            }
          >
            {Array.from(new Array(state.count || 1)).map((item, key) => (
              <option value={key + 1} key={key}>
                {key + 1}
              </option>
            ))}
          </select>
        </div>
        <div className="d-flex w-100">
          <div className="col-6">
            <button className="btn btn-block btn-primary">
              {Lang.get("Submit")}
            </button>
          </div>
          <div className="col-6">
            <button
              type="button"
              className="btn btn-block btn-secondary"
              onClick={onClose}
            >
              {Lang.get("Close")}
            </button>
          </div>
        </div>
      </form>
    </ErrorBoundary>
  );
});
