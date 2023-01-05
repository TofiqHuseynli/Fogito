import React, { useEffect } from "react";
import { ErrorBoundary, Lang } from "fogito-core-ui";
import { Tooltip } from "antd";
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
        console.log("delete", reference[index]);
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
      setEditorState({
        draggedOver: {
          item: item,
          deepIndex: deepIndex,
          dragPosition: position,
        },
      });
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
      <div className="col-12 cr-pointer">
        <div
          className="default-textarea p-0 overflow-hidden"
          style={{ position: "relative" }}
        >
          {/* EDITOR NUMBERS on the left */}
          <div
            className="editor-count d-flex flex-column h-100 _ai-end pl-3 pr-2"
            style={{
              position: "absolute",
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
          <div className="react-json_editor py-2">
            {/* Editor's FIRST line */}
            <div className="d-flex editor-line _jc-between">
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

const JsonEditorItem = ({
  item,
  index,
  editorState,
  setEditorState,
  parameters,
  onEdit,
  formRef,
  onDragAndDrop,
  deepIndex,
  parentType,
  onNewLineAdd,
  onDelete,
}) => {
  const { isDragging, dragged, draggedOver } = editorState;
  // visiblity of dropdowns
  const [typeVisible, setTypeVisible] = React.useState(false);
  const [booleanVisible, setBooleanVisible] = React.useState(false);
  // controlled inputs
  const [keyInput, setKeyInput] = React.useState(item.key);
  const [valueInput, setValueInput] = React.useState(item.value);
  const [commentInput, setCommentInput] = React.useState(item.comment);

  const types = [
    { value: "string", label: "string" },
    { value: "boolean", label: "boolean" },
    { value: "integer", label: "integer" },
    { value: "float", label: "float" },
    { value: "array", label: "array" },
    { value: "object", label: "object" },
  ];
  const booleans = [
    { label: "true", value: true },
    { label: false, value: false },
  ];

  const renderTypes = () => {
    return (
      <div className="dropdown_type">
        {types.map((dropdown, dropdownIndex) => (
          <p
            className="dropdown-item fs-12 cr-pointer"
            key={dropdownIndex}
            onClick={() => {
              onEdit(deepIndex, "type", dropdown.value);
              setTypeVisible(false);
            }}
          >
            {dropdown.label}
          </p>
        ))}
      </div>
    );
  };

  const renderValue = (item, index) => {
    let content = (
      <>
        <div
          onClick={() => {
            setEditorState({
              editValue: deepIndex,
              editComment: false,
              editKey: false,
            });
          }}
          style={{ minWidth: 10 }}
        >
          {!item.value ? (
            <div className="text-danger">null</div>
          ) : (
            <div className="d-flex">
              <div
                style={{
                  width: item.value.length > 50 && 200,
                  height: 17,
                  overflow: "hidden",
                  wordBreak: "break-all",
                }}
              >
                {item.type !== "array" && item.type !== "object" && item.value}
              </div>
              {item.value.length > 50 && "..."}
            </div>
          )}
        </div>
      </>
    );

    if (item.type !== "boolean") return content;

    return (
      <>
        <Tooltip
          title={
            <div className="dropdown_type">
              {booleans.map((dropdown, ddIndex) => (
                <p
                  className="dropdown-item fs-12 cr-pointer"
                  key={`ddindex-${ddIndex}`}
                  onClick={() => {
                    onEdit(deepIndex, "value", dropdown.value);
                    setBooleanVisible(false);
                  }}
                >
                  {dropdown.label}
                </p>
              ))}
            </div>
          }
          trigger={"click"}
          placement={"bottom"}
          visible={booleanVisible}
          onVisibleChange={(visible) => setBooleanVisible(visible)}
          overlayStyle={{ minWidth: 90 }}
          color="#FFF"
        >
          <div onClick={() => setBooleanVisible(true)}>
            {item.value === "" ? (
              <div className="text-danger">null</div>
            ) : (
              String(item.value)
            )}
          </div>
        </Tooltip>
      </>
    );
  };

  const renderClosingLine = () => {
    return (
      <div className="column d-flex flex-column">
        <div
          className="d-flex __jc_between editor-line"
          style={{
            paddingLeft: 50 + deepIndex.length * 20,
            position: "relative",
          }}
        >
          <div className="d-flex">{item.type === "array" ? "]" : "}"}</div>
        </div>
      </div>
    );
  };

  const renderRecursive = () => {
    return (
      <>
        {item.value?.map((nestedItem, nestedIndex) => (
          <JsonEditorItem
            item={nestedItem}
            index={nestedIndex}
            key={`${nestedIndex}-jsonitem`}
            editorState={editorState}
            setEditorState={setEditorState}
            parameters={item.value}
            onEdit={onEdit}
            onDragAndDrop={onDragAndDrop}
            formRef={formRef}
            deepIndex={[...deepIndex, nestedIndex]}
            parentType={item.type}
            onNewLineAdd={onNewLineAdd}
            onDelete={onDelete}
          />
        ))}
      </>
    );
  };

  return (
    <ErrorBoundary>
      <div className="column d-flex flex-column">
        <div
          className="d-flex __jc_between editor-line"
          style={{
            paddingLeft: 50 + deepIndex.length * 20,
            position: "relative",
            marginTop:
              isDragging &&
              draggedOver.deepIndex?.toString() === deepIndex.toString() &&
              draggedOver.dragPosition === "top" &&
              "10px",
            marginBottom:
              isDragging &&
              draggedOver.deepIndex?.toString() === deepIndex.toString() &&
              draggedOver.dragPosition === "bottom" &&
              "10px",
            transition: "all ease-in-out 0.3s",
          }}
          draggable="true"
          onDragStart={(e) => onDragAndDrop.dragStart(e, deepIndex, item)}
          // onDragOver={(e) => onDragAndDrop.dragOver(e, deepIndex, item)}
          onDragEnd={(e) => onDragAndDrop.dragEnd(e)}
        >
          <div className="d-flex">
            {/* KEY */}
            <>
              <input
                className={`is_required text-light ${
                  item.is_required ? "active" : ""
                }`}
                type="checkbox"
                onChange={(e) =>
                  onEdit(deepIndex, "is_required", !!e.target.checked ? 1 : 0)
                }
                style={{ marginLeft: deepIndex.length * 20 }}
              />
              {editorState.editKey.toString() === deepIndex.toString() ? (
                <div className="json_edit d-flex" ref={formRef}>
                  <form onSubmit={() => onEdit(deepIndex, "key", keyInput)}>
                    <input
                      type="text"
                      className="json_input"
                      id="inlineFormInputGroup"
                      value={keyInput}
                      autoFocus={true}
                      onChange={(e) => setKeyInput(e.target.value)}
                    />
                    <i
                      className="feather feather-check"
                      onClick={() => onEdit(deepIndex, "key", keyInput)}
                    />
                  </form>
                </div>
              ) : (
                <div
                  style={{ marginRight: "8px" }}
                  onClick={() =>
                    parentType !== "array" &&
                    setEditorState({ editKey: deepIndex })
                  }
                >
                  {parentType === "array" ? `"${index}":` : `${item.key}":`}
                </div>
              )}
            </>

            {/* TYPE */}
            <div className="type d-flex">
              <Tooltip
                title={renderTypes()}
                trigger={"click"}
                placement={"bottom"}
                visible={!!typeVisible}
                onVisibleChange={(typeVisible) => setTypeVisible(typeVisible)}
                overlayStyle={{ minWidth: 90 }}
                color="#FFF"
              >
                ({item.type}) &nbsp;
              </Tooltip>
              <div className="text-dark">
                {(item.type === "object" && "{") ||
                  (item.type === "array" && "[")}
              </div>
            </div>

            {/* VALUE */}
            <>
              {editorState.editValue.toString() === deepIndex.toString() ? (
                <div className="json_edit d-flex" ref={formRef}>
                  <form onSubmit={() => onEdit(deepIndex, "value", valueInput)}>
                    {item.type !== "integer" ? (
                      <>
                        <input
                          type="text"
                          className="json_input"
                          value={valueInput}
                          autoFocus
                          // onBlur={() => setNewLine(false)}
                          onChange={(e) => setValueInput(e.target.value)}
                        />
                        <i
                          className="feather feather-check"
                          onClick={() => onEdit(deepIndex, "value", valueInput)}
                        />
                      </>
                    ) : (
                      <>
                        <input
                          type="text"
                          className="json_input"
                          name="integer"
                          id="integer"
                          value={item.value}
                          autoFocus
                          onChange={(e) => setValueInput(e.target.value)}
                        />
                        <i
                          className="feather feather-check"
                          onClick={() => onEdit(deepIndex, "value", valueInput)}
                        />
                      </>
                    )}
                  </form>
                </div>
              ) : (
                renderValue(item, index)
              )}
            </>

            {/* COMMENT */}
            <>
              {editorState.editComment.toString() === deepIndex.toString() ? (
                <div className="json_edit d-flex" ref={formRef}>
                  <form
                    onSubmit={() => onEdit(deepIndex, "comment", commentInput)}
                  >
                    <input
                      className="json_input ml-4"
                      placeholder="Comment"
                      value={commentInput}
                      autoFocus
                      onChange={(e) => setCommentInput(e.target.value)}
                    />
                    <i
                      className="feather feather-check"
                      onClick={() => onEdit(deepIndex, "comment", commentInput)}
                    />
                  </form>
                </div>
              ) : (
                <div
                  className="text-muted ml-3 json_comment"
                  onClick={() => setEditorState({ editComment: deepIndex })}
                >
                  {!item.comment ? (
                    <div className="text-gold">// write comment</div>
                  ) : (
                    <>
                      {`// ${item.comment.substring(0, 50)}`}
                      {item.comment.length > 50 && "..."}
                    </>
                  )}
                </div>
              )}
            </>
          </div>

          {/* ADD/REMOVE BUTTON */}
          <div className="d-flex _center a-r__buttons">
            {/* add */}
            <i
              className="feather feather-plus editor-line-btn mr-2"
              onClick={() => {
                setEditorState({ newLine: deepIndex });
              }}
            />
            {/* remove */}
            <i
              className="feather feather-trash-2 text-danger editor-line-btn mr-3"
              onClick={() => onDelete(deepIndex, item)}
            />
          </div>

          {/* 2 div for drag and drop */}

          {isDragging && (
            <>
              <div
                onDragOver={(e) =>
                  onDragAndDrop.dragOver(e, deepIndex, item, "top")
                }
                style={{
                  position: "absolute",
                  top: 0,
                  height: "50%",
                  width: "100%",
                  // background: "red",
                }}
              ></div>
              <div
                onDragOver={(e) =>
                  onDragAndDrop.dragOver(e, deepIndex, item, "bottom")
                }
                style={{
                  position: "absolute",
                  bottom: 0,
                  height: "50%",
                  width: "100%",
                  // background: "yellow",
                  zIndex: 0,
                }}
              ></div>
            </>
          )}
        </div>
        {editorState.newLine.toString() === deepIndex.toString() && (
          <NewLine
            formRef={formRef}
            types={types}
            booleans={booleans}
            parentType={parentType}
            item={item}
            deepIndex={deepIndex}
            onNewLineAdd={onNewLineAdd}
          />
        )}
      </div>

      {(item.type === "object" || item.type === "array") && renderRecursive()}
      {(item.type === "object" || item.type === "array") && renderClosingLine()}
    </ErrorBoundary>
  );
};

const NewLine = ({
  formRef,
  types,
  booleans,
  parentType,
  item,
  deepIndex,
  onNewLineAdd,
}) => {
  const [key, setKey] = React.useState("");
  const [type, setType] = React.useState("string");
  const [value, setValue] = React.useState("");
  const [booleanValue, setBooleanValue] = React.useState("true");

  const renderValue = () => {
    if (type === "object" || type === "array") return null;
    if (type === "boolean") {
      return (
        <select
          className="badge-select"
          onChange={(e) => setBooleanValue(e.target.value.toString())}
        >
          <option disabled={value !== false}>Type</option>
          {booleans.map((d, i) => (
            <option key={i} value={d.label}>
              {d.label}
            </option>
          ))}
        </select>
      );
    }
    return (
      <>
        <input
          type={type !== "string" ? "number" : "text"}
          className="badge-input"
          placeholder={"value"}
          autoFocus={parentType === "array" ? true : false}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </>
    );
  };

  return (
    <ErrorBoundary>
      <form
        ref={formRef}
        className="px-5 d-flex static__width"
        onSubmit={() => {
          const newItem = {
            key: key,
            type: type,
            value: value,
          };
          onNewLineAdd(deepIndex, newItem);
        }}
      >
        {/* KEY */}
        {item.type === "array" ||
        (parentType === "array" && item.type !== "object") ? (
          <div />
        ) : (
          <>
            <input
              autoFocus={true}
              className="badge-input"
              placeholder={"field"}
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />{" "}
            :
          </>
        )}

        {/* TYPE */}
        <select
          className="badge-select"
          defaultValue={"string"}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="" disabled={type !== ""}>
            {Lang.get("Type")}
          </option>
          {types.map((d, i) => (
            <option key={i} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>

        {/* VALUE */}
        {renderValue()}

        {/* BUTTONS */}
        <button className="btn badge-ok_btn">{Lang.get("ok")}</button>
        <button
          className="btn badge-x_btn"
          onClick={() => console.log("click")}
        >
          x
        </button>
      </form>
    </ErrorBoundary>
  );
};
