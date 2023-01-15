import React from "react";
import { ErrorBoundary, Lang } from "fogito-core-ui";

export const NewLine = ({
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
