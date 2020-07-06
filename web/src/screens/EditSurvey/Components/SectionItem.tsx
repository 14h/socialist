import { Item } from '../../../types';
import React from 'react';
import { TranslationEditor } from './TranslationEditor';
import { ItemOptions } from './ItemOptions';
import { SurveyStore } from '@utils/hooks';
import { Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons/lib';

type TProps = {
    item: Item;
    editMode: boolean;
    surveyStore: SurveyStore;
    sectionIndex: number;
    itemIndex: number;
};

export const SectionItem = (props: TProps) => {
    const {
        item,
        editMode,
        surveyStore,
        sectionIndex,
        itemIndex,
    } = props;

    const updateItem = (newItem: Item) => surveyStore.updateItem(sectionIndex, itemIndex, newItem);

    if (!item) {
        return null;
    }

    return (
        <div className={`item-wrapper ${editMode && 'item-wrapper-selected'}`}>
            <div className='section-item-actions'>
                <Popconfirm
                    title="Are you sure?"
                    onConfirm={console.log}
                    okText="Delete"
                    cancelText="Cancel"
                >
                    <Button
                        type="link"
                        style={{ color: '#ff4d4faa' }}>
                        Delete<DeleteOutlined/>
                    </Button>
                </Popconfirm>
            </div>
            <h3>Question: </h3>
            <TranslationEditor
                description={item?.description}
                updateDescription={console.log}
                editMode={editMode}
                autoFocus={true}
            />
            <h3>Options: </h3>
            <ItemOptions
                item={item}
                updateItem={updateItem}
                editMode={editMode}
            />

        </div>
    );
};
