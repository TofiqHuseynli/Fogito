import { useMemo, useCallback, useReducer } from "react";

export const useModal = () => {
  const [state, setState] = useReducer((a, b) => ({ ...a, ...b }), {
    modals: [],
  });

  const show = useCallback(
    (id) => {
      let modals = state.modals;
      if (!modals.find((key) => key === id)) {
        modals.push(id);
      }
      setState({
        modals,
      });
    },
    [state.modals]
  );

  const hide = useCallback(
    (id) => {
      let modals = state.modals.filter((key) => key !== id);
      setState({
        modals,
      });
    },
    [state.modals]
  );

  const toggle = useCallback(
    (id) => {
      if (state.modals.find((key) => key === id)) {
        hide(id);
      } else {
        show(id);
      }
    },
    [hide, show, state.modals]
  );

  let values = {
    show,
    hide,
    toggle,
    modals: state.modals,
  };

  state.modals.forEach((key) => {
    values[key] = true;
  });

  return useMemo(() => values, [values]);
};
