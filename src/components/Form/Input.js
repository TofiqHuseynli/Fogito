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
  label = null,
  checked = false,
  onChange,
  disabled = false,
  theme = "primary",
  className = "",
  style,
}) => {
  return (
    <button
      type="button"
      className={classNames("form-check d-flex align-items-center p-0", {
        [className]: className,
      })}
      onClick={() => {
        if (!disabled) {
          onChange(!checked);
        }
      }}
    >
      <div
        style={style}
        className={classNames(
          "checkbox d-flex align-items-center justify-content-center",
          {
            "bg-primary": theme === "primary" && checked,
            "bg-success": theme === "success" && checked,
            "bg-white": !checked,
            disabled,
          }
        )}
      >
        {checked == true && (
          <i className="feather feather-check font-weight-bold text-white" />
        )}
      </div>
      {label && (
        <label className="form-control-label mb-0 ml-2 text-muted">
          {label}
        </label>
      )}
    </button>
  );
};
