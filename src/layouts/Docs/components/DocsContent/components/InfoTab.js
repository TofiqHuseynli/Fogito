import React from 'react';
import {ErrorBoundary,Lang,} from "fogito-core-ui";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export function InfoTab({state, setState})
{
    return (
        <ErrorBoundary>
            <label>{Lang.get("Description")}</label>
            <div className='w-100 mb-4' style={{ borderRadius:10 }}  >
                <CKEditor
                    editor={ ClassicEditor }
                    data={state.data.description}
                    onChange={ ( event, editor ) => setState({data: {...state.data, description: editor.getData()}})}
                    style={{"border": "1px solid blue"}}
                />
            </div>
        </ErrorBoundary>
    )
}
