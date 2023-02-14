import React from "react";
import { JsonEditorItem } from "./components";
import { ErrorBoundary } from "fogito-core-ui";
import { useOutsideAlerter } from "@hooks";

export const MyJsonEditor = ({ state, setState }) => {
  const [editorState, setEditorState] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    {
      // currently edited  parameters
      editKey: false,
      editValue: false,
      editComment: false,
      newLine: false,
      // drag and drop
      isDragging: false,
      dragged: { item: false, index: false },
      draggedOver: { item: false, index: false, dragPosition: false },
    }
  );

  const formRef = React.useRef();

  const onEdit = (deepIndex, parameter, val) => {
    const _state = { ...state };
    let reference = _state.data.parameters;
    let i = 0;

    // finding item and referencing it
    for (let index of deepIndex) {
      if (i === deepIndex.length - 1) {
        // last iteration
        reference = reference[index];
      } else {
        reference = reference[index].value;
      }
      i = i + 1;
    }

    // edit functionality
    reference[parameter] = val;
    if (parameter === "type") {
      if (val === "boolean") reference.value = false;
      if (val === "string") reference.value = "";
      if (val === "array") reference.value = [];
      if (val === "object") reference.value = [];
      if (val === "integer") reference.value = 0;
      if (val === "float") reference.value === 0;
    }

    setEditorState({ editKey: false, editValue: false, editComment: false });
    setState(_state);
  };

  const onNewLineAdd = (deepIndex, item) => {
    const _state = { ...state };
    let reference = _state.data.parameters;
    let i = 0;

    // finding item and referencing it
    for (let index of deepIndex) {
      if (i === deepIndex.length - 1) {
        // last iteration
        if (reference[index] instanceof Array) {
          reference[index].push(item);
        } else {
          reference.splice(index + 1, 0, item);
        }
      } else {
        reference = reference[index].value;
      }
      i = i + 1;
    }
    setEditorState({
      editKey: false,
      editValue: false,
      editComment: false,
      newLine: false,
    });
    setState(_state);
  };

  const onDelete = (deepIndex, item) => {
    const _state = { ...state };
    let reference = _state.data.parameters;
    let i = 0;

    for (let index of deepIndex) {
      if (i === deepIndex.length - 1) {
        // last iteration
        reference.splice(index, 1);
      } else {
        reference = reference[index].value;
      }
      i = i + 1;
    }
    setState(_state);
  };

  const onDragAndDrop = {
    dragStart: (e, deepIndex, item) => {
      e.stopPropagation();
      setEditorState({
        isDragging: true,
        dragged: { item: item, deepIndex: deepIndex },
      });
    },
    dragOver: (e, deepIndex, item, position) => {
      e.preventDefault();
      let draggedOver = {
        item: item,
        deepIndex: deepIndex,
        dragPosition: position,
      };
      if (
        JSON.stringify(draggedOver) !== JSON.stringify(editorState.draggedOver)
      ) {
        setEditorState({
          draggedOver: draggedOver,
        });
      }
    },
    dragEnd: (e) => {
      e.stopPropagation();
      let _state = { ...state };
      const parameters = _state.data.parameters;

      const cleanup = () => {
        setEditorState({
          isDragging: false,
          dragged: { item: null, deepIndex: null },
          draggedOver: { item: null, deepIndex: null },
        });
      };

      const dragged = editorState.dragged.deepIndex;
      const draggedOver = editorState.draggedOver.deepIndex;

      if (dragged.toString() === draggedOver.toString()) return cleanup();

      const isParent = () => {
        if (dragged.length === draggedOver.length) return false;
        const line = draggedOver.slice(dragged.length - 1);
        if (line.toString() === dragged.toString()) return true;
        return false;
      };

      if (isParent()) return;

      const findAndDrag = (array, item) => {
        for (let i of array) {
          let found =
            i.key === item.key && i.value.toString() === item.value.toString();
          if (found) {
            const index = array.findIndex((_i) => _i === i);
            array.splice(index, 1);
            break;
          }
          if (i.value instanceof Array) findAndDrag(i.value, item);
        }
      };

      const findAndDrop = (array, item) => {
        for (let i of array) {
          let found =
            i.key === item.key && i.value.toString() === item.value.toString();
          if (found) {
            const index = array.findIndex((_i) => _i === i);
            if (editorState.draggedOver.dragPosition === "bottom") {
              array.splice(index + 1, 0, editorState.dragged.item);
            } else {
              array.splice(index, 0, editorState.dragged.item);
            }
            break;
          }
          if (i.value instanceof Array) findAndDrop(i.value, item);
        }
      };

      findAndDrag(parameters, editorState.dragged.item);
      findAndDrop(parameters, editorState.draggedOver.item);
      setState(_state);
      cleanup();
    },
  };

  // When clicked outside form it will be closed.
  useOutsideAlerter(formRef, () => {
    formRef.current.dispatchEvent(new Event("submit", { cancelable: true }));
    setEditorState({ editKey: false, editValue: false, editComment: false });
  });

  return (
    <ErrorBoundary>
      <div className="col-12 cursor-pointer">
        <div className="default-textarea p-0 overflow-hidden position-relative">
          {/* EDITOR NUMBERS on the left */}
          <div
            className="editor-count position-absolute d-flex flex-column h-100 align-items-end pl-3 pr-2"
            style={{
              paddingTop: 3,
              borderRadius: "5px 0 0 5px",
              zIndex: 10,
              userSelect: "none",
            }}
          >
            {Array.from(Array(200).keys()).map((number, numberIndex) => (
              <div
                key={numberIndex}
                style={{ color: "#AAA0A0", marginTop: 10 }}
              >
                {number}
              </div>
            ))}
          </div>

          {/* EDITOR CONTENT */}
          <div
            className="react-json_editor py-2"
            onDragOver={(e) => e.preventDefault()}
          >
            {/* Editor's FIRST line */}
            <div className="d-flex editor-line justify-content-between">
              <div className="d-flex">
                <div className="type">(object)</div>
                <div className="ml-2">{"{"}</div>
              </div>
              <div className="d-flex">
                <div className="d-flex _center">
                  <i className="feather feather-plus editor-line-btn mr-3" />
                </div>
              </div>
            </div>
            {/* Editor's BODY */}
            <div style={{ marginLeft: "1.25rem" }}>
              {state.data?.parameters?.map((item, index) => (
                <JsonEditorItem
                  item={item}
                  index={index}
                  key={`${index}-jsonitem`}
                  editorState={editorState}
                  setEditorState={setEditorState}
                  parameters={state.data?.parameters}
                  onEdit={onEdit}
                  onDragAndDrop={onDragAndDrop}
                  formRef={formRef}
                  deepIndex={[index]}
                  parentType={"object"}
                  onNewLineAdd={onNewLineAdd}
                  onDelete={onDelete}
                />
              ))}
            </div>

            {/* Editor's LAST line */}
            <div>
              <div className="editor-line">{"}"}</div>
            </div>
          </div>
          {/* end EDITOR CONTENT */}
        </div>
      </div>
    </ErrorBoundary>
  );
};
