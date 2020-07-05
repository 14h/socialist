import React, { useContext, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
// @ts-ignore
// import ImageResize from 'quill-image-resize-module-react';
import { Button, Input, Modal } from 'antd';
import { CoreCtx } from '../../../index';
import { Translation } from '../../Translations';
import { TranslationRef } from '../../../types';
import { useOnClickOutside } from '@utils/hooks';


// Quill.register('modules/imageResize', ImageResize);



type TProps = {
    description: TranslationRef;
    updateDescription: (newName: string) => any;
    onDelete: () => any;
};

export const TranslationEditor = (props: TProps) => {
    const {
        updateDescription,
        description,
        onDelete,
    } = props;

    const [translations, setTranslations] = useContext(CoreCtx).translations;
    const translation = description ? translations.get(description) : {};
    const currentLang = 'en';
    const content = translation?.[currentLang];

    const [showModal, setShowModal] = useState(false);
    const [selectedTranslationKey, setSelectedTranslationKey] = useState<Translation["key"] | null>(description);
    const [searchValue, setSearchValue] = useState('');

    const [filteredTranslations, setFilteredTranslations] = useState<[string, Translation][]>(Array.from(translations))

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

    const onChangeSearch = (e: any) => {
        const newSearchValue = e.target.value;

        setSearchValue(newSearchValue);


        setFilteredTranslations(
            Array.from(translations).filter(
                ([, t]) => t[currentLang].includes(newSearchValue)
            )
        );
    }

    const onSelectTranslation = () => {
        if (selectedTranslationKey) {
            updateDescription(selectedTranslationKey)
        }
    }



    if(!editMode) {
        return (
            <div
                className='t-editor'
                onClick={() => setEditMode(true)}
            >
                <Button.Group>
                    <Button
                        type='link'
                        className='t-editor-action-button'
                        onClick={() => setShowModal(true)}
                    >
                        New Translation
                    </Button>
                    <Button
                        type="link"
                        className='t-editor-action-button'
                        onClick={() => setShowModal(true)}
                    >
                        Select Translation
                    </Button>
                    <Button
                        type="link"
                        className='t-editor-delete-button'
                        onClick={onDelete}

                    >
                        Delete
                    </Button>

                </Button.Group>
                <Modal
                    title="Change Translation"
                    visible={showModal}
                    width={768}
                    onOk={onSelectTranslation}
                    onCancel={() => setShowModal(false)}
                    okText="Select"
                    afterClose={
                        () => setSelectedTranslationKey(description)
                    }
                    destroyOnClose={true}
                >
                    <Input
                        value={searchValue}
                        onChange={onChangeSearch}
                        placeholder="Filter translations"
                    />
                    {
                        filteredTranslations.map(([key, t]) => (
                            <div
                                className={selectedTranslationKey === key ? 't-option selected' : 't-option'}
                                key={key}
                                onClick={() => setSelectedTranslationKey(key)}
                            >
                                <ReactQuill
                                    value={t[currentLang] || ''}
                                    readOnly={true}
                                    theme={"bubble"}
                                />
                            </div>

                        ))
                    }

                </Modal>
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
            <Button.Group>
                <Button
                    type='link'
                    className='t-editor-action-button'
                    onClick={() => setShowModal(true)}
                >
                    New Translation
                </Button>
                <Button
                    type="link"
                    className='t-editor-action-button'
                    onClick={() => setShowModal(true)}
                >
                    Select Translation
                </Button>
                <Button
                    type="link"
                    className='t-editor-delete-button'
                    onClick={onDelete}

                >
                    Delete
                </Button>

            </Button.Group>
            <Modal
                title="Change Translation"
                visible={showModal}
                width={768}
                onOk={onSelectTranslation}
                onCancel={() => setShowModal(false)}
                okText="Select"
                afterClose={
                    () => setSelectedTranslationKey(description)
                }
                destroyOnClose={true}
            >
                <Input
                    value={searchValue}
                    onChange={onChangeSearch}
                    placeholder="Filter translations"
                />
                {
                    filteredTranslations.map(([key, t]) => (
                        <div
                            className={selectedTranslationKey === key ? 't-option selected' : 't-option'}
                            key={key}
                            onClick={() => setSelectedTranslationKey(key)}
                        >
                            <ReactQuill
                                value={t[currentLang] || ''}
                                readOnly={true}
                                theme={"bubble"}
                            />
                        </div>

                    ))
                }

            </Modal>


            <br />
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
