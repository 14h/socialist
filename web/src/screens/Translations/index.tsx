import React, { useEffect, useState } from 'react';
import {
    Button,
    Layout,
    Tabs,
    Typography,
} from 'antd';

import './styles.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ArrowRightOutlined } from '@ant-design/icons';



type Translation = {
    key: number;
    en?: string;
    de?: string;
}

type Lang = 'en' | 'de';
const AVAILABLE_LANGS: Lang[] = ['en', 'de'];
const DEFAULT_TRANSLATIONS: Translation[] = [
    {
        key: 1,
        en: 'Who am I?',
        de: 'Wer bin ich?'
    },
    {
        key: 2,
        en: 'what am I doing?',
    },
]

const TranslationTable = ({
    translations,
    handleSave,
}: {
    translations: Translation[];
    handleSave: (translation: Translation) => void;
}) => {
    console.log(translations)
    return (
        <div className="translation-table">
            {
                translations.map((translation: Translation, index: number) => (
                    <div className="translation-row" key={`translation-${index}`}>
                        <div className="translation-column">
                            <ReactQuill
                                theme="snow"
                                value={translation.en}
                                onChange={(content: string) => {
                                    console.log(content)
                                    // handleSave({
                                    //     ...translation,
                                    //     en: content,
                                    // })
                                }}
                            />
                        </div>
                        <ArrowRightOutlined />
                        <div className="translation-column">
                            <ReactQuill
                                theme="snow"
                                value={translation.de}
                                onChange={(content: string) => {
                                    console.log(content)
                                }}/>
                        </div>

                    </div>
                ))
            }
        </div>
    )
}


const Translations = () => {
    const [translations, setTranslations] = useState<Translation[]>([]);
    const [lang, setLang] = useState<Lang>('en');
    const [selectedItem, setSelectedItem] = useState<Translation | null>(null);

    useEffect(()=>{
        setTranslations(DEFAULT_TRANSLATIONS);
    },[]);


    const deleteItem = (index: number) => {
        const list = translations.slice();
        list.splice(index, 1);
        setTranslations(list);
    };

    const handleAdd = () => {
        setTranslations((t: Translation[]) => [
            {
                key: 3,
                en: '',
                de: ''
            },
            ...t,
        ])
    }

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
            <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
                Add a row
            </Button>
            <TranslationTable
                translations={translations}
                handleSave={handleSave}
            />
        </Layout>
    );
};

export default Translations;
