import React from 'react';
import ReactQuill from 'react-quill';


type TProps = {
    placeholder?: string;
    value: string;
    onChange: any;
};

export const TranslationEditor = (props: TProps) => {
    const {
        value,
        onChange
    } = props;

    return (
        <div className="text-editor">
            <ReactQuill
                value={value}
                onChange={onChange}
                placeholder={props.placeholder}
                modules={
                    {
                        toolbar: [


                            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                            ['blockquote', 'code-block'],

                            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
                            [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
                            [{ 'direction': 'rtl' }],                         // text direction

                            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

                            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                            [{ 'font': [] }],
                            [{ 'align': [] }],

                            ['clean'],                                         // remove formatting button
                            ['image']
                        ],
                    }
                }
                formats={
                    [
                        "header",
                        "font",
                        "size",
                        "bold",
                        "italic",
                        "underline",
                        "strike",
                        "blockquote",
                        "list",
                        "bullet",
                        "indent",
                        "link",
                        "image",
                        "color"
                    ]
                }
                theme={"snow"} // pass false to use minimal theme
            />
        </div>
    )

}
