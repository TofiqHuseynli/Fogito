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
            <input className={classNames('form-control', {propsClass})}
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
            <textarea  className={classNames('form-control', {propsClass})}
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
                    className="form-control custom-select"
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