import React, { useContext } from 'react';
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

    if (item.type === 'multi') {
        return (
            <div>
                <Button
                    onClick={handleOnClick}
                    style={{ float: 'right' }}
                >
                    Add option
                </Button>
                <div>
                    {
                        (item?.options ?? []).map((option: MultiItemOption) => {

                            return (
                                <div>
                                    <TranslationEditor
                                        description={option?.description}
                                        updateDescription={console.log}
                                    />
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }


    return (
        <div/>
    );
};
