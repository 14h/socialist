import { Item, Section, Survey } from '../types';
import { useEffect, useState } from 'react';
import { fetchSurvey } from '../services/surveyService';
import { User } from '../types/models/User';

export type SurveyStore = {
    value: Survey;
    setValue: (s: Survey) => void;
    updateSection: (s: Section) => void;
    insertSection: (s: Section) => void;
    deleteSection: (key: string) => void;
    insertItem: (i: Item, sectionIndex: number, itemIndex: number) => void;
    updateItem: (sectionIndex: number, itemIndex: number, item: Item) => void;
    duplicateItem: (sectionIndex: number, itemIndex: number) => void;
    deleteItem: (sectionIndex: number, itemIndex: number) => void;
    getItem: (sectionIndex: number, itemIndex: number) => Item;
}

const DEFAULT_SURVEY: Survey = {
    id: 'laoding',
    meta: {
        name: 'loading',
    },
    sections: [],
};


export const useSurvey = (
    userToken: string | null,
    surveyId: string | null | undefined,
    user: User | null,
): SurveyStore => {
    const [value, setValue] = useState<Survey>(DEFAULT_SURVEY);

    useEffect(() => {
        (async () => {
            if (!surveyId || !userToken || !user) {
                return;
            }

            const survey = await fetchSurvey(
                userToken,
                surveyId,
                user.email,
                user.id,
            );
            if (!survey) {
                return;
            }

            setValue(survey);
        })();
    }, [surveyId, user, userToken]);

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
                name: `${ itemToClone.name }_${ sectionsClone[sectionIndex].items.length }`,
            },
        );

        sectionsClone[sectionIndex].items.splice(
            itemIndex + 1,
            0,
            newItem,
        );

        const newValue = {
            ...value,
            sections: sectionsClone,
        };
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
        };
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
        };
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
        };
        setValue(newValue);
    };

    const updateSection = (newPage: Section) => {
        const sectionsClone = value.sections.slice();
        const sectionIndex = sectionsClone.findIndex((p: Section) => p.name === newPage.name);
        sectionsClone[sectionIndex] = newPage;
        const newValue = {
            ...value,
            sections: sectionsClone,
        };
        setValue(newValue);
    };

    const insertSection = (section: Section) => {
        const sectionsClone = value.sections?.slice() ?? [];

        sectionsClone.push(section);

        const newValue = {
            ...value,
            sections: sectionsClone,
        };

        setValue(newValue);
    };

    const deleteSection = (key: string) => {
        const sectionIndex = value.sections.findIndex((s: Section) => s.name === key);
        if (sectionIndex < 0) {
            console.warn('Page not found');
            return;
        }

        const sectionsClone = value.sections.slice();
        sectionsClone.splice(sectionIndex, 1);
        const newValue = {
            ...value,
            sections: sectionsClone,
        };
        setValue(newValue);
    };

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
    };
};

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
        [ref, handler],
    );
}
