import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import { TranslationRef } from '../../../types';
import { fetchTranslation, updateTranslation } from '../../../services/translationService';

type TProps = {
    id: TranslationRef;
    editMode: boolean;
    userToken: string;
};

export const TranslationEditor = (props: TProps) => {
    const {
        id,
        userToken,
        editMode,
    } = props;
    const [translation, setTranslation] = useState<any>(null);

    useEffect( () => {
        if (!id) {
            return;
        }
        fetchTranslation(userToken, id)
            .then(setTranslation)
            .catch(console.error);
    }, [])

    const currentLang = 'en';
    const content = translation?.[currentLang];

    const tRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (editMode && tRef?.current) {
            tRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [editMode]);


    const onChangeTranslation = (text: string) => {
        const data = Object.assign(
            {},
            translation,
            {
                [currentLang]: text,
            },
        );

        setTranslation(data);
        updateTranslation(userToken, data)
            .then(console.log)
            .catch(console.error);
    };

    if (!translation) {
        return null;
    }

    if (!editMode) {
        return (
            <div
                className='t-editor'
            >
                <ReactQuill
                    value={ content || '' }
                    readOnly={ true }
                    theme={ 'bubble' }
                />
            </div>
        );
    }

    return (
        <div
            className='t-editor'
            ref={ tRef }
        >
            <ReactQuill
                value={ content || '' }
                onChange={ onChangeTranslation }
                modules={
                    {
                        toolbar: [

                            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                            ['blockquote'],

                            // [{ 'header': 1 }, { 'header': 2 }, { 'header': 3 }],               // custom button values
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
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
    );

};
