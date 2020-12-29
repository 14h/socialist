import React from 'react';
import '../styles.css';
import { Item, MultiItemOption } from '../../../types';
import { Button, List } from 'antd';
import { TranslationEditor } from './TranslationEditor';
import { DeleteOutlined } from '@ant-design/icons/lib';
import { Translation } from '../../Translations';

type TProps = {
    item: Item;
    updateItem: (item: Item) => void;
    editMode: boolean;
};

export const ItemOptions = (props: TProps) => {
    const { item, updateItem, editMode } = props;
    // const [translations, setTranslations] = useContext(CoreCtx).translations;
    const translations = new Map<string, Translation>();
    const setTranslations = console.log;
    // TODO fix translations here
    const currentLang = 'en';

    if (item.type !== 'multi') {
        return null;
    }

    const handleOnClick = () => {
        const newTranslationKey = translations.size.toString();
        const newTranslation = {
            [currentLang]: '',
        };

        const cloneMap = new Map(translations);
        cloneMap.set(
            newTranslationKey,
            newTranslation,
        );

        setTranslations(
            cloneMap,
        );

        const newOption: MultiItemOption = {
            name: newTranslationKey,
            description: newTranslationKey,
        };

        const itemOptions = [
            ...(item?.options ?? []),
            newOption,
        ];

        const newItem = Object.assign(
            {},
            item,
            {
                options: itemOptions,
            },
        );

        updateItem(newItem);
    };

    const updateOptionDescription = (translationRef: string, index: number) => {
        const newOption: MultiItemOption = {
            name: translationRef,
            description: translationRef,
        };

        const newOptions = (item?.options ?? []).slice();
        newOptions.splice(
            index,
            1,
            newOption,
        );

        const newItem = Object.assign(
            {},
            item,
            {
                options: newOptions,
            },
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
            },
        );

        updateItem(newItem);
    };

    return (
        <div className='item-option-wrapper'>
            <List
                header={ <div>Options</div> }
                locale={ { emptyText: 'No options found!' } }
                footer={
                    <Button
                        onClick={ handleOnClick }
                        className='item-option-add-button'
                    >
                        Add option
                    </Button>
                }
                bordered={ true }
                dataSource={ (item?.options ?? []) as any }
                size="small"
                renderItem={ (option: MultiItemOption, index: number) => (
                    <List.Item
                        extra={
                            <div
                                key="list-delete"
                                onClick={ () => onDeleteOption(index) }
                            >
                                <DeleteOutlined style={ { fontSize: '24px', color: '#a61d24', marginLeft: '24px' } }/>
                            </div> }
                    >
                        <TranslationEditor
                            description={ option?.description }
                            updateDescription={ (t) => updateOptionDescription(t, index) }
                            editMode={ editMode }
                        />
                    </List.Item>
                ) }
            />

        </div>
    );
};
