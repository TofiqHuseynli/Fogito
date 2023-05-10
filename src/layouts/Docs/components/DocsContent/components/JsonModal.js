import React, {useState} from 'react';
import {ErrorBoundary, Textarea,Lang,} from "fogito-core-ui";
import {prepareText} from "../components/ProxyModal/actions";

export const JsonModal = ({state}) => {

    const [text,setText] = useState(prepareText(state.data.parameters));

    return (
        <ErrorBoundary>
            <div>
                <Textarea
                    placeholder={Lang.get("Request Parameters")}
                    className='form-control'
                    style={{height:'400px'}}
                    onChange={e=>setText(e.target.value)}
                    value={text}
                />
            </div>
        </ErrorBoundary>
    )
}
