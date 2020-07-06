import React, { useContext, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
// @ts-ignore
// import ImageResize from 'quill-image-resize-module-react';
import { CoreCtx } from '../../../index';
import { TranslationRef } from '../../../types';
import { useOnClickOutside } from '@utils/hooks';


// Quill.register('modules/imageResize', ImageResize);



type TProps = {
    description: TranslationRef;
    updateDescription: (newName: string) => any;
};

export const TranslationEditor = (props: TProps) => {
    const {
        updateDescription,
        description,
    } = props;

    const [translations, setTranslations] = useContext(CoreCtx).translations;
    const translation = description ? translations.get(description) : {};
    const currentLang = 'en';
    const content = translation?.[currentLang];

    const [editMode, setEditMode] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useOnClickOutside(ref, () => setEditMode(false));

    const onChangeTranslation = (text: string) => {
        const newTranslationKey = description || translations.size.toString();

        if (!description) {
            updateDescription(newTranslationKey);
        }
        const newTranslation = Object.assign(
            {},
            translation,
            {
                [currentLang]: text,
            }
        );
        const cloneMap = new Map(translations);
        cloneMap.set(
            newTranslationKey,
            newTranslation,
        );

        setTranslations(
            cloneMap
        );
    }

    if(!editMode) {
        return (
            <div
                className='t-editor'
                onClick={() => setEditMode(true)}
            >
                <ReactQuill
                    value={content || ''}
                    readOnly={true}
                    theme={"bubble"}
                />
            </div>
        )
    }

    return (
        <div
            className='t-editor'
            ref={ref}
        >
            <ReactQuill
                value={content || ''}
                onChange={onChangeTranslation}
                modules={
                    {
                        toolbar: [

                            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                            ['blockquote'],

                            // [{ 'header': 1 }, { 'header': 2 }, { 'header': 3 }],               // custom button values
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            [{ 'direction': 'rtl' }],                         // text direction

                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

                            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                            // [{ 'font': [] }],
                            [{ 'align': [] }],

                            ['clean'],                                         // remove formatting button
                            ['image'],
                        ],

                    }
                }
            />
        </div>
    )

}
