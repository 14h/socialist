import React, { useContext, useState } from 'react';
import '../styles.css';
import { Item, MultiItemOption } from '../../../types';
import { Button } from 'antd';
import { TranslationEditor } from './TranslationEditor';
import { CoreCtx } from '../../../index';

type TProps = {
    item: Item;
    updateItem: (item: Item) => void;
};

export const ItemOptions = (props: TProps) => {
    const { item, updateItem } = props;
    const [translations, setTranslations] = useContext(CoreCtx).translations;
    const currentLang = 'en';

    if (item.type !== 'multi') {
        return null;
    }

    const handleOnClick = () => {
        const newTranslationKey = translations.size.toString();
        const newTranslation = {
            [currentLang]: ''
        }

        const cloneMap = new Map(translations)
        cloneMap.set(
            newTranslationKey,
            newTranslation,
        );

        setTranslations(
            cloneMap
        );

        const newOption: MultiItemOption = {
            name: newTranslationKey,
            description: newTranslationKey,
        };

        const itemOptions = [
            ...(item?.options ?? []),
            newOption
        ];

        const newItem = Object.assign(
            {},
            item,
            {
                options: itemOptions,
            }
        );

        updateItem(newItem);
    }

    const updateOptionDescription = (translationRef: string, index: number) => {
        const newOption: MultiItemOption = {
            name: translationRef,
            description: translationRef
        }

        const newOptions = (item?.options ?? []).slice();
        newOptions.splice(
            index,
            1,
            newOption
        );

        const newItem = Object.assign(
            {},
            item,
            {
                options: newOptions,
            }
        );

        updateItem(newItem);

    };

    const onDeleteOption = (index: number) => {
        const newOptions = (item?.options ?? []).slice();
        newOptions.splice(
            index,
            1,
        );

        const newItem = Object.assign(
            {},
            item,
            {
                options: newOptions,
            }
        );

        updateItem(newItem);
    }

    return (
        <div className='item-option-wrapper'>
            <Button
                onClick={handleOnClick}
                className='item-option-add-button'
            >
                Add option
            </Button>
            <div>
                {
                    (item?.options ?? []).map((option: MultiItemOption, index: number) =>
                        <TranslationEditor
                            description={option?.description}
                            updateDescription={(t) => updateOptionDescription(t, index)}
                            onDelete={() => onDeleteOption(index)}
                            key={index}
                        />
                    )
                }
            </div>
        </div>
    );
};
