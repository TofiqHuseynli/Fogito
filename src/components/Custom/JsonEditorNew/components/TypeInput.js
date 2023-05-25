import React from 'react';
import {ErrorBoundary} from "fogito-core-ui";
import {Tooltip} from "antd";
import {Parameters} from "@plugins";

export const TypeInput = ({value, onEdit}) => {

    const types = Parameters.getVariableTypes()

    const [visible, setVisible] = React.useState(false)
    const style = { minWidth: 90 }

    const getTypes = () => {
        return (
            <div className='dropdown_type'  >
                {types.map((d, i) =>
                    <p className='dropdown-item fs-12 cr-pointer'
                       key={i}
                       onClick={() => onEdit(d.value) + setVisible(false)}
                    >
                        {d.label}
                    </p>
                )}
            </div>
        )
    }

    return (
        <ErrorBoundary>
            <div className='text-danger'>
                <Tooltip title={getTypes()}
                         trigger={'click'}
                         placement={'bottom'}
                         open={!!visible}
                         onOpenChange={(visible) => setVisible(visible)}
                         overlayStyle={style}
                         color='#FFF'
                >
                    ({value})
                </Tooltip>
            </div>
        </ErrorBoundary>
    )
}
