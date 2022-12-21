import React from 'react';
import {ErrorBoundary} from "fogito-core-ui";
import {Lang} from "@plugins";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export function Content({state, setState})
{
    return (
        <ErrorBoundary>
            {/* Text Editor */}
            <label className='parent__label mt-4' >
                {Lang.get("Description")}
            </label>
            <div className='w-100 mb-4' style={{ borderRadius:10 }}  >
                <CKEditor
                    editor={ ClassicEditor }
                    data={state.data.description}
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        console.log( { event, editor, data } )
                        setState({...state, data: {...state.data, description: data}})
                    }}
                    style={{
                        "border": "1px solid blue"
                    }}
                />
            </div>
        </ErrorBoundary>
    )
}
