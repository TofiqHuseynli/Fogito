import React from "react";
import {
  ErrorBoundary,
  InputCheckbox,
  Loading,
  Lang,
  useToast,
} from "fogito-core-ui";
import { statusEdit, userPermissionList, userPermissionSet } from "@actions";

export const Permissions = React.memo(({ board, id }) => {
  const toast = useToast();
  const [state, setState] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    {
      loading: false,
      custom: false,
      data: [],
    }
  );

  const loadData = async () => {
    setState({ loading: true });
    let response = await userPermissionList({ board: board?.id, user: id });
    if (response) {
      setState({ loading: false });
      if (response.status === "success") {
        setState({
          data: response.data,
          custom: response.custom_permission_status,
        });
      } else {
        toast.fire({ icon: "error", title: response.description });
      }
    }
  };

  const onChange = async (field, value) => {
    setState({ loading: true });
    let response = await userPermissionSet({
      board: board?.id,
      user: id,
      field,
      value,
    });
    if (response) {
      setState({
        loading: false,
        data: state.data.map((item) => {
          if (field === "set_permission" && value) {
            item.value = value;
          } else {
            if (item.key === field) {
              item.value = value;
            }
          }
          return item;
        }),
      });
    } else {
      toast.fire({ icon: "error", title: response.description });
    }
  };

  const onPermissionSet = async (value) => {
    setState({ loading: true });
    let response = await statusEdit({
      board: board?.id,
      user: id,
      field: "permission",
      value,
    });
    if (response) {
      setState({ loading: false });
      if (response.status === "success") {
        setState({ custom: value });
      } else {
        toast.fire({ icon: "error", title: response.description });
      }
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  return (
    <ErrorBoundary>
      {state.loading && <Loading />}
      <p>
        <b>Note: This permissions will be set for this member</b>
      </p>
      <div>
        <InputCheckbox
          checked={state.custom}
          label={Lang.get("CustomPermission")}
          onChange={(e) => onPermissionSet(e.target.checked)}
        />
      </div>
      {state.custom == true &&
        state.data.map((item, key) => (
          <div className="mt-3" key={key}>
            <InputCheckbox
              label={item.title}
              checked={item.value}
              onChange={(e) => onChange(item.key, e.target.checked)}
            />
          </div>
        ))}
    </ErrorBoundary>
  );
});
