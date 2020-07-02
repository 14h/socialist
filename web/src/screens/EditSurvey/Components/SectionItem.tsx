import { Item, TranslationRef } from '../../../types';
import React, { useContext } from 'react';
import { CoreCtx } from '../../../index';
import { TranslationEditor } from './TranslationEditor';
import { ItemOptions } from './ItemOptions';
import { SurveyStore } from '@utils/hooks';

type TProps = {
    item: Item;
    selected: boolean;
    surveyStore: SurveyStore;
    sectionIndex: number;
    itemIndex: number;
};

export const SectionItem = (props: TProps) => {
    const {
        item,
        selected,
        surveyStore,
        sectionIndex,
        itemIndex,
    } = props;
    const [translations] = useContext(CoreCtx).translations;

    const currentLang = 'en';
    const updateItem = (newItem: Item) => surveyStore.updateItem(sectionIndex, itemIndex, newItem);

    const updateDescription = (description: TranslationRef) => updateItem(Object.assign({}, item, { description }));


    if (!item) {
        return null;
    }

    return (
        <div className={`item-wrapper ${selected && 'item-wrapper-selected'}`}>
            <div
                key={item.name}
                className='item-preview'
            >
                <label htmlFor={item.name}>
                    <TranslationEditor
                        description={item?.description}
                        updateDescription={console.log}
                        onDelete={console.log}
                    />
                </label>
                <ItemOptions
                    item={item}
                    updateItem={updateItem}
                />
            </div>

        </div>
    );
};
