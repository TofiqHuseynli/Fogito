import React from "react";
import classNames from "classnames";

let typingTimeOut = null;
export const InputLazy = ({
  value,
  onChange,
  timeout = 500,
  action = () => {
    console.log("No action passed!");
  },
  className = "form-control form-control-alternative form-control-md",
  placeholder = "Type something...",
  type = "text",
}) => {
  const changeHandler = (e) => {
    let value = e.target.value;
    onChange(value);
    if (typingTimeOut) {
      clearTimeout(typingTimeOut);
    }
    typingTimeOut = setTimeout(() => {
      action(value);
    }, timeout);
  };

  return (
    <input
      {...{ className, type, placeholder, value }}
      onChange={changeHandler}
    />
  );
};

export const InputCheckbox = ({
    theme,
    label,
    checked,
    disabled,
    onChange,
    className,
  }) => {
  const id = `_${Math.random().toString(36).substr(2, 9)}`;
  return (
      <div
          className={classNames("custom-control custom-checkbox", {
            "custom-control-alternative": theme === "alternative",
            [className]: className,
          })}
      >
        <input
            id={id}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={onChange}
            className="custom-control-input"
        />
        <label htmlFor={id} className="custom-control-label">
          {label}
        </label>
      </div>
  );
};