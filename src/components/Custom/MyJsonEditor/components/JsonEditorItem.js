import React from "react";
import { NewLine } from "./NewLine";
import { ErrorBoundary } from "fogito-core-ui";
import Tooltip from "antd/lib/tooltip";

export const JsonEditorItem = ({
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
          open={booleanVisible}
          onOpenChange={(visible) => setBooleanVisible(visible)}
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
      <div className="column d-flex flex-column position-relative">
        <div
          className="d-flex justify-content-between editor-line"
          style={{
            paddingLeft: 50 + deepIndex.length * 20,
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
          className="d-flex justify-content-between editor-line position-relative"
          style={{
            paddingLeft: 50 + deepIndex.length * 20,
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
                open={!!typeVisible}
                onOpenChange={(typeVisible) => setTypeVisible(typeVisible)}
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
                onDragEnter={(e) =>
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
                onDragEnter={(e) =>
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
