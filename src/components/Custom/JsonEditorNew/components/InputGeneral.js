import React, {useState} from 'react';
import {useOutsideAlerter} from "@hooks";

export const InputGeneral = ({value, onEdit, className,defaultValue}) => {

    const [openInput, setOpenInput] = useState(false);

    const containerRef = React.useRef();
    const inputRef = React.useRef(null);

    useOutsideAlerter(containerRef, () => setOpenInput(false));

    return (
        <div
            ref={containerRef}
        >
            {openInput === false ? (
                <span
                    className={className}
                    onClick={async () => {
                        await setOpenInput(true)
                        inputRef.current.focus()
                    }}
                >
                    {value ? value : defaultValue}
                </span>
            ) : (
                <div className='editor-item-input-container' style={{width: '150px'}}>
                    <input
                        ref={inputRef}
                        type="text"
                        onChange={(e) => onEdit(e.target.value)}
                        value={value}
                    />
                    <i
                        onClick={() => setOpenInput(false)}
                        className='feather feather-check'
                    />
                </div>
            )}
        </div>
    )
}
