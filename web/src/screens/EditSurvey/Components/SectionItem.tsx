import { Item } from '../../../types';
import React from 'react';
import { TranslationEditor } from './TranslationEditor';
import { ItemOptions } from './ItemOptions';
import { SurveyStore } from '@utils/hooks';
import { Button, Popconfirm } from 'antd';
import { ArrowDownOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons/lib';
import { ItemFormat, SelectFormatModal } from './ItemFormat';
import { ItemSettings } from './ItemSettings';

type TProps = {
    item: Item;
    editMode: boolean;
    surveyStore: SurveyStore;
    sectionIndex: number;
    itemIndex: number;
    userToken: string;
};

export const SectionItem = (props: TProps) => {
    const {
        userToken,
        item,
        editMode,
        surveyStore,
        sectionIndex,
        itemIndex,
    } = props;


    if (!item) {
        return null;
    }

    const updateItem = (newItem: Item) => surveyStore.updateItem(sectionIndex, itemIndex, newItem);

    return (

        <div className={ `item-wrapper ${ editMode && 'item-wrapper-selected' }` }>

            <ItemSettings
                item={ item }
                updateItem={ updateItem }
            />
            <hr/>
            <TranslationEditor
                id={ item?.description }
                userToken={ userToken }
                editMode={ true }
            />

            <ItemOptions
                userToken={ userToken }
                item={ item }
                updateItem={ updateItem }
                editMode={ editMode }
            />

            <div className='item-actions'>
                <Popconfirm
                    title="Are you sure?"
                    onConfirm={ () => surveyStore.deleteItem(sectionIndex, itemIndex) }
                    okText="Delete"
                    cancelText="Cancel"
                >
                    <DeleteOutlined style={ { fontSize: '24px', color: '#a61d24' } }/>
                </Popconfirm>
            </div>

        </div>
    );
};
