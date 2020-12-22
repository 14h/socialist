import React, { Dispatch, SetStateAction, useContext, useState } from 'react';
import { Button, Layout, Select } from 'antd';

import './styles.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ArrowRightOutlined } from '@ant-design/icons';
import { CoreCtx } from '../../index';

export type Translation = {
    [key: string]: string;
};

export type Lang = 'en' | 'de' | 'ar' | 'it' | 'fi';
const AVAILABLE_LANGS: Lang[] = ['en', 'de', 'ar', 'it', 'fi'];

type TranslationTableProps = {
    langFrom: Lang;
    langTo: Lang;
};
const TranslationTable = (props: TranslationTableProps) => {
    const {langFrom, langTo} = props;
    // const [translations, setTranslations] = useContext(CoreCtx).translations;
    const translations = new Map<string, Translation>();
    const setTranslations = console.log;

    const handleSave = (lang: Lang, key: string, translation: Translation) => (newContent: string) => {
        const newTranslation = Object.assign(
            {},
            translation,
            {
                [lang]: newContent,
            }
        );
        const cloneMap = new Map(translations)
        cloneMap.set(
            key,
            newTranslation,
        );

        setTranslations(
            cloneMap
        )
    }

    return (
        <div className="translation-table">
            {
                Array.from(translations).map(([key, translation]) => (
                    <div className="translation-row" key={`translation-${key}`}>
                        <div className="translation-column">
                            <ReactQuill
                                theme="snow"
                                value={translation[langFrom] || ''}
                                onChange={handleSave(langFrom, key, translation)}
                            />
                        </div>
                        <ArrowRightOutlined/>
                        <div className="translation-column">
                            <ReactQuill
                                theme="snow"
                                value={translation[langTo] || ''}
                                onChange={handleSave(langTo, key, translation)}
                            />
                        </div>
                    </div>
                ))
            }
        </div>
    );
};

const Translations = () => {
    // const [translations, setTranslations] = useContext(CoreCtx).translations;
    const translations = new Map<string, Translation>();
    const setTranslations = console.log;
    const [langFrom, setLangFrom] = useState<Lang>('en');
    const [langTo, setLangTo] = useState<Lang>('de');
    const currentLang = 'en';

    const handleAdd = () => {
        const newTranslation = {
            [currentLang]: ''
        }

        const cloneMap = new Map(translations)
        cloneMap.set(
            translations.size.toString(),
            newTranslation,
        );

        setTranslations(
            cloneMap
        )
    };


    return (
        <Layout className="container-layout">
            <div className="translations-actions">
                <div>
                    <Select
                        className="translations-actions-select"
                        defaultValue={langFrom}
                        onChange={setLangFrom}
                        disabled
                    >
                        {AVAILABLE_LANGS.map((lang: Lang) => (
                            <Select.Option key={`from-${lang}`} value={lang}>
                                {lang}
                            </Select.Option>
                        ))}
                    </Select>
                    <ArrowRightOutlined/>
                    <Select
                        className="translations-actions-select"
                        defaultValue={langTo}
                        onChange={setLangTo}
                    >
                        {AVAILABLE_LANGS.filter((lang: Lang) => lang !== 'en').map(
                            (lang: Lang) => (
                                <Select.Option key={`to-${lang}`} value={lang}>
                                    {lang}
                                </Select.Option>
                            ),
                        )}
                    </Select>
                </div>
                <Button onClick={handleAdd} type="primary">
                    Add a row
                </Button>
            </div>
            <TranslationTable
                langFrom={langFrom}
                langTo={langTo}
            />
        </Layout>
    );
};

export default Translations;
