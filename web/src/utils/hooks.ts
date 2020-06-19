import { useLocalStorage } from './helpers';
import { Item, Section, Survey } from '../types';
import { Translation } from '../screens/Translations';
import { useEffect, useState } from 'react';

export type SurveyStore = {
    value: Survey;
    setValue: (s: Survey) => any;
    updateSection: (s: Section) => any;
    insertNewSection: () => any;
    deleteSection: (pageIndex: number) => any;
    insertItem: (i: Item, sectionIndex: number, itemIndex: number) => any;
    updateItem: (pageIndex: number, itemIndex: number, item: Item) => any;
    duplicateItem: (pageIndex: number, itemIndex: number) => any;
    deleteItem: (pageIndex: number, itemIndex: number) => any;
}

const SURVEY: Survey = {
    name: 'survey1',
    description: 'survey_title',
    sections: [
        {
            name: 'page1',
            description: 'page1_description',
            conditions: [],
            items: [
                {
                    type: 'number',
                    name: 'question1',
                    description: '2',
                    minValue: 0,
                    maxValue: 10,
                },
                {
                    type: 'text',
                    name: 'question2',
                    description: '3',
                    minCharacters: 0,
                    maxCharacters: 10,
                },
            ]
        },
        {
            name: 'page2',
            description: 'page2_description',
            conditions: [],
            items: [
                {
                    type: 'number',
                    name: 'question21',
                    description: '5',
                    minValue: 0,
                    maxValue: 10,
                },
                {
                    type: 'number',
                    name: 'question22',
                    description: '6',
                    minValue: 0,
                    maxValue: 10,
                },
            ]
        },
    ],
};


export const useSurvey = (surveyId: string | undefined): SurveyStore => {
    const [value, setValue] = useState<Survey>(
        SURVEY,
    );

    const duplicateItem = (
        pageIndex: number,
        itemIndex: number,
    ) => {
        const sectionsClone = value.sections.slice();
        const itemToClone = sectionsClone[pageIndex].items[itemIndex];
        const newItem = Object.assign(
            {},
            itemToClone,
            {
                name: `${itemToClone.name}_${sectionsClone[pageIndex].items.length}`
            }
        )

        sectionsClone[pageIndex].items.splice(
            itemIndex + 1,
            0,
            newItem,
        )

        const newValue = {
            ...value,
            sections: sectionsClone,
        }
        setValue(newValue);
    };
    const insertItem = (
        item: Item,
        sectionIndex: number,
        itemIndex: number,
    ) => {
        const sectionsClone = value.sections.slice();
        sectionsClone[sectionIndex].items.splice(
            itemIndex,
            0,
            item,
        );
        const newValue = {
            ...value,
            sections: sectionsClone,
        }
        setValue(newValue);
    };

    const deleteItem = (
        pageIndex: number,
        itemIndex: number,
    ) => {
        const sectionsClone = value.sections.slice();
        sectionsClone[pageIndex].items.splice(itemIndex, 1);
        const newValue = {
            ...value,
            sections: sectionsClone,
        }
        setValue(newValue);
    };

    const updateItem = (
        pageIndex: number,
        itemIndex: number,
        item: Item,
    ) => {
        const sectionsClone = value.sections.slice();
        sectionsClone[pageIndex].items[itemIndex] = item;
        const newValue = {
            ...value,
            sections: sectionsClone,
        }
        setValue(newValue);
    }

    const updateSection = (newPage: Section) => {
        const sectionsClone = value.sections.slice();
        const pageIndex = sectionsClone.findIndex((p: Section) => p.name === newPage.name)
        sectionsClone[pageIndex] = newPage;
        const newValue = {
            ...value,
            sections: sectionsClone,
        }
        setValue(newValue);
    };

    const insertNewSection = () => {
        const sectionsClone = value.sections.slice();

        sectionsClone.push({
            name: `newPage_${sectionsClone.length}`,
            description: null,
            items: [],
            conditions: []
        });

        const newValue = {
            ...value,
            sections: sectionsClone,
        }

        setValue(newValue);
    }

    const deleteSection = (pageIndex: number) => {
        const sectionsClone = value.sections.slice();
        sectionsClone.splice(pageIndex, 1);
        const newValue = {
            ...value,
            sections: sectionsClone,
        }
        setValue(newValue);
    }


    return {
        value,
        setValue,
        updateSection,
        insertNewSection,
        deleteSection,
        duplicateItem,
        insertItem,
        deleteItem,
        updateItem,
    }
}
