import { SURVEY } from './types';
import { useLocalStorage } from '../../utils/helpers';
import { Item, Survey } from '../../types';
import { Translation } from '../Translations';

export type SurveyStore = {
    survey: Survey;
    setSurvey: any;
    items: any[];
    setItems: any;
    duplicateItem: any;
    insertNewItem: any;
    deleteItem: any;
    updateItem: any;
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

export const useSurvey = (surveyId: string | undefined): SurveyStore => {
    const surveyListStore: any = useLocalStorage(
        '24p_survey',
        SURVEY,
    );

    const [survey, setSurvey] = surveyListStore;

    const duplicateItem = (index: number) => {
        const listClone = survey.items.slice();
        listClone.splice(
            index + 1,
            0,
            Object.assign({}, survey.items[index], { name: `${survey.items[index].name}_duplicate` }),
        );
        const newSurvey = {
            ...survey,
            items: listClone,
        }
        setSurvey(newSurvey);
    };
    const insertNewItem = (
        index: number,
        type: Item['type'],
    ) => {
        const listClone = survey.items.slice();
        listClone.splice(index, 0, {
            name: 'new_item',
            title: 'New Item, please change name and title',
            type,
        });
        const newSurvey = {
            ...survey,
            items: listClone,
        }
        setSurvey(newSurvey);
    };
    const deleteItem = (index: number) => {
        const listClone = survey.items.slice();
        listClone.splice(index, 1);
        const newSurvey = {
            ...survey,
            items: listClone,
        }
        setSurvey(newSurvey);
    };

    const updateItem = (newItem: Item, index: number) => {
        const listClone = survey.items.slice();
        listClone[index] = newItem;
        const newSurvey = {
            ...survey,
            items: listClone,
        }
        setSurvey(newSurvey);
    }

    const setItems = (newItems: Item[]) => {
        const newSurvey = {
            ...survey,
            items: newItems,
        }
        setSurvey(newSurvey);
    }



    return {
        items: survey.items,
        setItems,
        survey,
        setSurvey,
        duplicateItem,
        insertNewItem,
        deleteItem,
        updateItem,
    }
}
