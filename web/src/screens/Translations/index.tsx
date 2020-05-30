import React, { useState } from 'react';
import { Button, Layout, Select } from 'antd';

import './styles.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useLocalStorage } from '@utils/helpers';

type Translation = {
    [key: string]: string;
};

export type Lang = 'en' | 'de' | 'ar' | 'it' | 'fi';
const AVAILABLE_LANGS: Lang[] = ['en', 'de', 'ar', 'it', 'fi'];
export const DEFAULT_TRANSLATIONS: Translation[] = [
    {
        key: '11234',
        en: 'Who am I?',
        de: 'Wer bin ich?',
    },
    {
        key: '11235',
        en: 'what am I doing?',
    },
    {
        key: '11236',
        en: 'English',
        de: 'German',
        ar: 'arabic',
    },
];

const TranslationTable = ({
    translations,
    handleSave,
    langFrom,
    langTo,
}: {
    translations: Translation[];
    handleSave: (translation: Translation) => void;
    langFrom: Lang;
    langTo: Lang;
}) => {
    return (
        <div className="translation-table">
            {translations.map((
                translation: Translation,
                index: number,
            ) => (
                <div className="translation-row" key={`translation-${index}`}>
                    <div className="translation-column">
                        <ReactQuill
                            theme="snow"
                            value={translation[langFrom] || ''}
                            onChange={(content: string) => {
                                handleSave({
                                    ...translation,
                                    [langFrom]: content,
                                });
                            }}
                        />
                    </div>
                    <ArrowRightOutlined/>
                    <div className="translation-column">
                        <ReactQuill
                            theme="snow"
                            value={translation[langTo] || ''}
                            onChange={(content: string) => {
                                handleSave({
                                    ...translation,
                                    [langTo]: content,
                                });
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

const Translations = () => {
    const [translations, setTranslations] = useLocalStorage<Translation[]>(
        'SURVEY_TRANSLATIONS',
        DEFAULT_TRANSLATIONS,
    );
    const [langFrom, setLangFrom] = useState<Lang>('en');
    const [langTo, setLangTo] = useState<Lang>('de');

    const handleAdd = () => {
        setTranslations((t: Translation[]) => [
            {
                key: '123444',
                en: '',
                de: '',
            },
            ...t,
        ]);
    };

    const handleSave = (translation: Translation) => {
        const newData = [...translations];
        const index = newData.findIndex((i: any) => translation.key === i.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...translation,
        });
        setTranslations(newData);
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
                translations={translations}
                handleSave={handleSave}
                langFrom={langFrom}
                langTo={langTo}
            />
        </Layout>
    );
};

export default Translations;
