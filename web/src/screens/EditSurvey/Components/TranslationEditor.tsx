import React, { useContext, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import { CoreCtx } from '../../../index';
import { TranslationRef } from '../../../types';

type TProps = {
    description: TranslationRef;
    updateDescription: (newName: string) => any;
    editMode: boolean;
};

export const TranslationEditor = (props: TProps) => {
    const {
        updateDescription,
        description,
        editMode,
    } = props;

    const [translations, setTranslations] = useContext(CoreCtx).translations;
    const translation = description ? translations.get(description) : {};
    const currentLang = 'en';
    const content = translation?.[currentLang];

    const tRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(editMode && tRef?.current) {
            tRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [editMode]);


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
            ref={tRef}
        >
            <ReactQuill
                value={content || ''}
                onChange={onChangeTranslation}
                modules={
                    {
                        toolbar: [

                            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                            ['blockquote'],

                            // [{ 'sider': 1 }, { 'sider': 2 }, { 'sider': 3 }],               // custom button values
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
