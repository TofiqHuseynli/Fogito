import React from 'react';
import {ErrorBoundary,Lang,} from "fogito-core-ui";
import { Editor } from "@tinymce/tinymce-react";

export function InfoTab({state, setState})
{

    const editorTheme = (classname) => {
        switch (classname) {
            case "dark":
                return "oxide-dark" ||  "dark";
            case "night":
                return "oxide-dark" || "dark";
            default:
                return null;
        }
    };

    return (
        <ErrorBoundary>
            <label>{Lang.get("Description")}</label>
            <div className='w-100 mb-4' style={{ borderRadius:10 }}  >
                <Editor
                    style={{ borderRadius: 5 }}
                    onEditorChange={(description) =>
                        setState({data: {...state.data, description: description }})
                    }
                    apiKey="82nbg8ctqdxe6wzh685u0inzhlffhw2yr10iptjmngucrniy"
                    value={state.data.description}
                    // onInit={() => {setState({ editorLoading: false })}}
                    init={{
                        skin: editorTheme(document.body.className),
                        content_css: editorTheme(document.body.className),
                        content_style:
                            "body { font-size: 14pt; font-family: Arial; }",
                        height: 500,
                        menubar: false,
                        plugins: [
                            "advlist autolink link image lists charmap print preview hr anchor pagebreak",
                            "searchreplace wordcount visualblocks code fullscreen insertdatetime media nonbreaking",
                            "table emoticons template paste help",
                        ],
                        toolbar:
                            "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | " +
                            "bullist numlist outdent indent | link image | print preview media fullpage | " +
                            "forecolor backcolor emoticons | help",
                    }}
                />
            </div>
        </ErrorBoundary>
    )
}
