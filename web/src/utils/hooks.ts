import { useLocalStorage } from './helpers';
import { Item, Page, Survey } from '../types';
import { Translation } from '../screens/Translations';

export type SurveyStore = {
    value: Survey;
    setValue: (s: Survey) => any;
    updatePage: (p: Page) => any;
    insertNewPage: () => any;
    deletePage: (pageIndex: number) => any;
    insertNewItem: (pageIndex: number, itemIndex: number, type: Item['type']) => any;
    updateItem: (pageIndex: number, itemIndex: number, item: Item) => any;
    duplicateItem: (pageIndex: number, itemIndex: number) => any;
    deleteItem: (pageIndex: number, itemIndex: number) => any;
}

export type TranslationsStore = {
    translations: Translation[];
    setTranslation: (t: Translation) => void;
    getTranslation: (key: string) => string;
}

export const useTranslations = (): TranslationsStore => {
    const [translations, setTranslations]: any = useLocalStorage(
        '24p_translations',
        [
            {
                key: '1',
                en: 'Who am I?',
                de: 'Wer bin ich?',
            },
            {
                key: '2',
                en: 'what am I doing?',
                de: 'Was mache ich?',
            },
        ]
    );

    const getTranslation = (key: string): string => {
        return translations.find((t: any) => t.key === key)?.['en'] || ''
    }

    const setTranslation = (t: Translation) => {

        const translationIndex = translations.findIndex((tItem: any) => tItem.key === t.key);
        const newT = {
            ...translations?.[translationIndex],
            ...t,
        };

        const newTranslations = translations.slice();

        if (translationIndex === -1) {
            // translation doesn't exist
            newTranslations.push(newT);
        } else {
            newTranslations.splice(translationIndex, 1, newT);
        }


        setTranslations(newTranslations)
    }

    return {
        translations,
        setTranslation,
        getTranslation,
    }
}

const SURVEY: Survey = {
    name: 'survey1',
    title: 'survey_title',
    pages: [
        {
            name: 'page1',
            conditions: [],
            items: [
                {
                    type: 'number',
                    name: 'question1',
                    title: '2',
                    minValue: 0,
                    maxValue: 10,
                },
                {
                    type: 'text',
                    name: 'question2',
                    title: '3',
                    minCharacters: 0,
                    maxCharacters: 10,
                },
            ]
        },
        {
            name: 'page2',
            conditions: [],
            items: [
                {
                    type: 'number',
                    name: 'question21',
                    title: '5',
                    minValue: 0,
                    maxValue: 10,
                },
                {
                    type: 'number',
                    name: 'question22',
                    title: '6',
                    minValue: 0,
                    maxValue: 10,
                },
            ]
        },
    ],
};


export const useSurvey = (surveyId: string | undefined): SurveyStore => {
    const [value, setValue] = useLocalStorage<Survey>(
        '24p_survey',
        SURVEY,
    );

    const duplicateItem = (
        pageIndex: number,
        itemIndex: number,
    ) => {
        const pagesClone = value.pages.slice();
        const itemToClone = pagesClone[pageIndex].items[itemIndex];
        const newItem = Object.assign(
            {},
            itemToClone,
            {
                name: `${itemToClone.name}_${pagesClone[pageIndex].items.length}`
            }
        )

        pagesClone[pageIndex].items.splice(
            itemIndex + 1,
            0,
            newItem,
        )

        const newValue = {
            ...value,
            pages: pagesClone,
        }
        setValue(newValue);
    };
    const insertNewItem = (
        pageIndex: number,
        itemIndex: number,
        type: Item['type'],
    ) => {
        const pagesClone = value.pages.slice();
        pagesClone[pageIndex].items.splice(itemIndex, 0, {
            name: `new_item-${pagesClone[pageIndex].items.length}`,
            title: 'New Item, please change name and title',
            type,
        });
        const newValue = {
            ...value,
            pages: pagesClone,
        }
        setValue(newValue);
    };

    const deleteItem = (
        pageIndex: number,
        itemIndex: number,
    ) => {
        const pagesClone = value.pages.slice();
        pagesClone[pageIndex].items.splice(itemIndex, 1);
        const newValue = {
            ...value,
            pages: pagesClone,
        }
        setValue(newValue);
    };

    const updateItem = (
        pageIndex: number,
        itemIndex: number,
        item: Item,
    ) => {
        const pagesClone = value.pages.slice();
        pagesClone[pageIndex].items[itemIndex] = item;
        const newValue = {
            ...value,
            pages: pagesClone,
        }
        setValue(newValue);
    }

    const updatePage = (newPage: Page) => {
        const pagesClone = value.pages.slice();
        const pageIndex = pagesClone.findIndex((p: Page) => p.name === newPage.name)
        pagesClone[pageIndex] = newPage;
        const newValue = {
            ...value,
            pages: pagesClone,
        }
        setValue(newValue);
    };

    const insertNewPage = () => {
        const pagesClone = value.pages.slice();

        pagesClone.push({
            name: `newPage_${pagesClone.length}`,
            items: [],
            conditions: []
        });

        const newValue = {
            ...value,
            pages: pagesClone,
        }

        setValue(newValue);
    }

    const deletePage = (pageIndex: number) => {
        const pagesClone = value.pages.slice();
        pagesClone.splice(pageIndex, 1);
        const newValue = {
            ...value,
            pages: pagesClone,
        }
        setValue(newValue);
    }


    return {
        value,
        setValue,
        updatePage,
        insertNewPage,
        deletePage,
        duplicateItem,
        insertNewItem,
        deleteItem,
        updateItem,
    }
}
