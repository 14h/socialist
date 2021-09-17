import React from 'react';
import '../styles.less';
import { Item, MultiItemOption } from '../../../types';
import { Button, List } from 'antd';
import { TranslationEditor } from './TranslationEditor';
import { DeleteOutlined } from '@ant-design/icons/lib';
import { Translation } from '../../Translations';
import { AddOption } from './AddOption';
import { createTranslation } from '../../../services/translationService';

type TProps = {
    item: Item;
    updateItem: (item: Item) => void;
    editMode: boolean;
    userToken: string;
};

export const ItemOptions = (props: TProps) => {
    const { item, updateItem, editMode, userToken } = props;
    // TODO fix translations here
    const currentLang = 'en';

    if (item.type !== 'multi') {
        return null;
    }

    const handleOnClick = async (name: string) => {
        const translation = await createTranslation(userToken);
        const newOption: MultiItemOption = {
            name,
            description: translation.id,
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
                    <AddOption
                        callback={handleOnClick}
                    />
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
                            id={ option.description }
                            userToken={ userToken }
                            editMode={ editMode }
                        />
                    </List.Item>
                ) }
            />

        </div>
    );
};
