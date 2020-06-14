import React from 'react';
import ReactQuill, {Quill} from 'react-quill';
// @ts-ignore
import ImageResize from 'quill-image-resize-module-react';
import { Select } from 'antd';
import { Translation } from '../../Translations';


Quill.register('modules/imageResize', ImageResize);


type TProps = {
    placeholder?: string;
    value: string;
    onChange: any;
    updateName: (newName: string) => any;
    name: string;
    translations: Translation[]
};

export const TranslationEditor = (props: TProps) => {
    const {
        value,
        onChange,
        updateName,
        name,
        translations,
    } = props;

    return (
        <div className="translation-editor">
            <Select
                showSearch
                style={{ width: 200, margin: '0 auto', display: 'flex' }}
                placeholder="Select a translation"
                // optionFilterProp="children"
                onChange={updateName}
                // filterOption={(input: string, option: any) =>
                //     option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                // }
                value={name}
            >
                {
                    translations.filter(t => t.key).filter(t => t['en']).map((t: Translation, index: number) => (
                        <Select.Option
                            key={`t_${index}`}
                            value={t.key}
                        >
                            {t.key}
                        </Select.Option>
                    ))
                }
            </Select>
            <ReactQuill
                value={value}
                onChange={onChange}
                placeholder={props.placeholder}
                modules={
                    {
                        imageResize: {
                            parchment: Quill.import('parchment')
                        },
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
