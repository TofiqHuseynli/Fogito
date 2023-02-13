import React from 'react';
import {ErrorBoundary,Lang,} from "fogito-core-ui";



export const OptionsBtn = ({
   divClassName = '',
   onClick = ()=> {},
   className = '',
   title = 'Button',
   style = {},
}) => {
    return (
        <ErrorBoundary>
            <div className={divClassName} >
                <button
                    className={`btn options-btn ${className}`}
                    onClick={onClick}
                    style={style}

                >
                    {Lang.get(title)}
                </button>
            </div>
        </ErrorBoundary>
    )
}
