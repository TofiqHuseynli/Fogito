import React from "react";
import {Lang} from "@plugins";
import classNames from "classnames";


export const Inputs = (props) => {

    let {type } = props;

    switch (type) {
        case 'input':
            return  <Input {...props} />;
        case 'select':
            return  <Select {...props} />;
        case 'text-area':
            return  <TextArea {...props} />;
        case 'checkbox':
            return  <InputCheckbox {...props} />;
    }
}




const Input = (props) => {
    let {
        autoFocus = false,
        required = true,
        defaultValue,
        placeholder,
        propsClass = '',
        disabled = false,
        onChange,
        divClass = '',
        label,
        value,
        style,
    } = props;

    return (
        <div className={classNames(`${divClass}`)} >
            {label && <label className='label' >{Lang.get(label)}</label> }
            <input className={`form-control form-control-alternative ${propsClass}`}
                   defaultValue={defaultValue}
                   placeholder={placeholder}
                   autoFocus={autoFocus}
                   disabled={disabled}
                   onChange={onChange}
                   required={required}
                   value={value}
                   style={style}
            />
        </div>
    )
}


const TextArea = (props) => {
    let {
        autoFocus = false,
        required = true,
        defaultValue,
        placeholder,
        propsClass,
        onChange,
        divClass,
        label,
        value,
        style,
    } = props;

    return (
        <div className={classNames(`${divClass}`)} >
            {label && <label className='label' >{Lang.get(label)}</label> }
            <textarea  className={`form-control form-control-alternative ${propsClass}`}
                       onChange={onChange}
                       value={value}
                       defaultValue={defaultValue}
                       style={style}
                       placeholder={placeholder}
                       required={required}
                       autoFocus={autoFocus}
            />
        </div>
    )
}



const Select = (props) => {
    let {
        defaultTitle,
        placeholder,
        backColor,
        onSelect,
        selected,
        divClass,
        label,
        data
    } = props;

    return (
        <div className={`${divClass}`} >
            {label && <label className='label' >{Lang.get(label)}</label> }
            <select placeholder={placeholder}
                    className="custom-select border-none shadow-none"
                    style={{height: 45, paddingLeft: 15, border: 'none', color: '#737373', backgroundColor: backColor}}
                    onChange={onSelect}
            >
                <option value="none" selected disabled hidden>{defaultTitle || Lang.get('Choose')}</option>

                {
                    !!data && data.map((item, index) => (
                        <option key={index}
                                value={item.value || item.id}
                                selected={!!selected && (selected === (item.value || item.id)) && selected}
                        >
                            {Lang.get(item.label || item.title)}
                        </option>
                    ))
                }
            </select>
        </div>
    )
}


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