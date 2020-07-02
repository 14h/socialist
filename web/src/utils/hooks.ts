import { Item, Section, Survey } from '../types';
import { useEffect, useState } from 'react';

export type SurveyStore = {
    value: Survey;
    setValue: (s: Survey) => any;
    updateSection: (s: Section) => any;
    insertSection: (s: Section) => any;
    deleteSection: (sectionIndex: number) => any;
    insertItem: (i: Item, sectionIndex: number, itemIndex: number) => any;
    updateItem: (sectionIndex: number, itemIndex: number, item: Item) => any;
    duplicateItem: (sectionIndex: number, itemIndex: number) => any;
    deleteItem: (sectionIndex: number, itemIndex: number) => any;
    getItem: (sectionIndex: number, itemIndex: number) => Item;
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
                    type: 'multi',
                    name: 'question1',
                    description: '2',
                    options: [],
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
        sectionIndex: number,
        itemIndex: number,
    ) => {
        const sectionsClone = value.sections.slice();
        const itemToClone = sectionsClone[sectionIndex].items[itemIndex];
        const newItem = Object.assign(
            {},
            itemToClone,
            {
                name: `${itemToClone.name}_${sectionsClone[sectionIndex].items.length}`
            }
        )

        sectionsClone[sectionIndex].items.splice(
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
        sectionIndex: number,
        itemIndex: number,
    ) => {
        const sectionsClone = value.sections.slice();
        sectionsClone[sectionIndex].items.splice(itemIndex, 1);
        const newValue = {
            ...value,
            sections: sectionsClone,
        }
        setValue(newValue);
    };

    const updateItem = (
        sectionIndex: number,
        itemIndex: number,
        item: Item,
    ) => {
        const sectionsClone = value.sections.slice();
        sectionsClone[sectionIndex].items[itemIndex] = item;
        const newValue = {
            ...value,
            sections: sectionsClone,
        }
        setValue(newValue);
    }

    const updateSection = (newPage: Section) => {
        const sectionsClone = value.sections.slice();
        const sectionIndex = sectionsClone.findIndex((p: Section) => p.name === newPage.name)
        sectionsClone[sectionIndex] = newPage;
        const newValue = {
            ...value,
            sections: sectionsClone,
        }
        setValue(newValue);
    };

    const insertSection = (section: Section) => {
        const sectionsClone = value.sections.slice();

        sectionsClone.push(section);

        const newValue = {
            ...value,
            sections: sectionsClone,
        }

        setValue(newValue);
    }

    const deleteSection = (sectionIndex: number) => {
        const sectionsClone = value.sections.slice();
        sectionsClone.splice(sectionIndex, 1);
        const newValue = {
            ...value,
            sections: sectionsClone,
        }
        setValue(newValue);
    }

    const getItem = (sectionIndex: number, itemIndex: number) =>
        value?.sections?.[sectionIndex]?.items?.[itemIndex];


    return {
        value,
        setValue,
        updateSection,
        insertSection,
        deleteSection,
        duplicateItem,
        insertItem,
        deleteItem,
        updateItem,
        getItem,
    }
}

export function useOnClickOutside(ref: any, handler: any) {
    useEffect(
        () => {
            const listener = (event: any) => {
                // Do nothing if clicking ref's element or descendent elements
                if (!ref.current || ref.current.contains(event.target)) {
                    return;
                }

                handler(event);
            };

            document.addEventListener('mousedown', listener);
            document.addEventListener('touchstart', listener);

            return () => {
                document.removeEventListener('mousedown', listener);
                document.removeEventListener('touchstart', listener);
            };
        },
        // Add ref and handler to effect dependencies
        // It's worth noting that because passed in handler is a new ...
        // ... function on every render that will cause this effect ...
        // ... callback/cleanup to run every render. It's not a big deal ...
        // ... but to optimize you can wrap handler in useCallback before ...
        // ... passing it into this hook.
        [ref, handler]
    );
}
