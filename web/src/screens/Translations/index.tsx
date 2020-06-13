import React, { useState } from 'react';
import { Button, Layout, Select } from 'antd';

import './styles.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useTranslations } from '@utils/hooks';

export type Translation = {
    [key: string]: string;
};

export type Lang = 'en' | 'de' | 'ar' | 'it' | 'fi';
const AVAILABLE_LANGS: Lang[] = ['en', 'de', 'ar', 'it', 'fi'];

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
    const translationsStore = useTranslations();
    const [langFrom, setLangFrom] = useState<Lang>('en');
    const [langTo, setLangTo] = useState<Lang>('de');

    const handleAdd = () => {
        translationsStore.setTranslation(
            {
                key: translationsStore.translations.length.toString(),
                en: ''
            }
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
                translations={translationsStore.translations}
                handleSave={translationsStore.setTranslation}
                langFrom={langFrom}
                langTo={langTo}
            />
        </Layout>
    );
};

export default Translations;
