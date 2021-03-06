import { Item, Section, Survey } from '../types';
import { useContext, useEffect, useRef, useState } from 'react';
import { fetchSurvey, fetchSurveys, setSurveySections } from '../services/surveyService';
import { User } from '../types/models/User';
import { message } from 'antd';
import { CoreCtx } from '../index';
import { fetchOrganization } from '../services/orgService';

export type SurveyStore = {
    value: Survey;
    setValue: (s: Survey) => void;
    updateSection: (s: Section, index: number) => void;
    insertSection: (s: Section, index: number) => Promise<void>;
    deleteSection: (index: number) => void;
    insertItem: (i: Item, sectionIndex: number, itemIndex: number) => void;
    updateItem: (sectionIndex: number, itemIndex: number, item: Item) => Promise<void>;
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

export const useDebounce = <T>(
    value: T,
    delay = 500,
) => {
    const [ debouncedValue, setDebouncedValue ] = useState<T>(value);

    useEffect(
        () => {
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);

            return () => clearTimeout(handler);
        },
        [ value, delay ],
    );

    return debouncedValue;
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

    const insertItem = async (
        item: Item,
        sectionIndex: number,
        itemIndex: number,
    ) => {
        if (!userToken || !surveyId) {
            return;
        }

        const sectionsClone = value.sections.slice();
        const oldItems = sectionsClone[sectionIndex]?.items ?? [];
        sectionsClone[sectionIndex].items = [
            ...oldItems.slice(0, itemIndex),
            item,
            ...oldItems.slice(itemIndex),
        ] ;

        const newValue = {
            ...value,
            sections: sectionsClone,
        };

        setValue(newValue);

        try {
            await setSurveySections(userToken, surveyId, sectionsClone)

            setValue(newValue);
        } catch (err) {
            message.error(JSON.stringify(err))
        }
    };

    const deleteItem = async (
        sectionIndex: number,
        itemIndex: number,
    ) => {
        if (!userToken || !surveyId) {
            return;
        }

        const sectionsClone = value.sections.slice();
        sectionsClone[sectionIndex].items.splice(itemIndex, 1);
        const newValue = {
            ...value,
            sections: sectionsClone,
        };

        try {
            await setSurveySections(userToken, surveyId, sectionsClone)

            setValue(newValue);
        } catch (err) {
            message.error(JSON.stringify(err))
        }
    };

    const updateItem = async (
        sectionIndex: number,
        itemIndex: number,
        item: Item,
    ) => {
        if (!userToken || !surveyId) {
            return;
        }
        const sectionsClone = value.sections.slice();
        sectionsClone[sectionIndex].items[itemIndex] = item;
        const newValue = {
            ...value,
            sections: sectionsClone,
        };

        try {
            await setSurveySections(userToken, surveyId, sectionsClone)

            setValue(newValue);
        } catch (err) {
            message.error(JSON.stringify(err))
        }
    };

    const updateSection = async (newSection: Section, index: number) => {
        if (!userToken || !surveyId) {
            return;
        }

        const sectionsClone = value.sections.slice();

        sectionsClone[index] = newSection;

        const newValue = {
            ...value,
            sections: sectionsClone,
        };

        try {
            await setSurveySections(userToken, surveyId, sectionsClone)

            setValue(newValue);
        } catch (err) {
            message.error(JSON.stringify(err))
        }
    };

    const insertSection = async (section: Section, index: number) => {
        if (!userToken || !surveyId) {
            return;
        }

        const sections = [
            ...value.sections.slice(0, index),
            section,
            ...value.sections.slice(index),
        ];

        const newValue = {
            ...value,
            sections
        };

        try {
            await setSurveySections(userToken, surveyId, sections)

            setValue(newValue);
        } catch (err) {
            message.error(JSON.stringify(err))
        }
    };

    const deleteSection = async (index: number) => {
        if (!userToken || !surveyId) {
            return;
        }

        const sectionsClone = value.sections.slice();
        sectionsClone.splice(index, 1);
        const newValue = {
            ...value,
            sections: sectionsClone,
        };

        try {
            await setSurveySections(userToken, surveyId, sectionsClone)

            setValue(newValue);
        } catch (err) {
            message.error(JSON.stringify(err))
        }
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

export const useSurveys =  (
    orgId?: string,
): ReadonlyArray<Survey> => {
    const [surveys, setSurveys] = useState<ReadonlyArray<Survey>>([]);
    const {userToken} = useContext(CoreCtx);

    useEffect(() => {
        (async () => {
            if (!orgId || !userToken) {
                return;
            }

            try {
                const org = await fetchOrganization(orgId, userToken);
                if (!org?.surveys || !userToken) {

                    return;
                }

                // fetch user surveys
                const fetchedSurveys = await fetchSurveys(userToken, org.surveys.map(({ id }) => id));

                setSurveys(fetchedSurveys);

            } catch (err) {
                message.error(JSON.stringify(err?.message));
            }

        })();
    }, [userToken, orgId]);

    return surveys;
};

export const useElementBiEvent = <T extends HTMLElement>(
    eventA: keyof HTMLElementEventMap,
    eventB: keyof HTMLElementEventMap,
): [ React.MutableRefObject<T | null>, boolean ] => {
    const [ value, setValue ] = useState(false);

    const ref = useRef<T | null>(null);

    const handleTick = () => setValue(true);
    const handleTock = () => setValue(false);

    useEffect(
        () => {
            const node = ref.current;

            if (node) {
                node.addEventListener(eventA, handleTick);
                node.addEventListener(eventB, handleTock);

                return () => {
                    node.removeEventListener(eventA, handleTick);
                    node.removeEventListener(eventB, handleTock);
                };
            }

            return () => {
                // nop
            };
        },
        [ ref.current ],
    );

    return [ ref, value ];
};


export const useFocus = <T extends HTMLElement>(): [ React.MutableRefObject<T | null>, boolean ] =>
    useElementBiEvent<T>('focus', 'blur');
