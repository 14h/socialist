import { Item, TranslationRef } from '../../../types';
import React, { useContext } from 'react';
import { CoreCtx } from '../../../index';
import { TranslationEditor } from './TranslationEditor';
import { ItemOptions } from './ItemOptions';
import { SurveyStore } from '@utils/hooks';
import { Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons/lib';

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

    const updateItem = (newItem: Item) => surveyStore.updateItem(sectionIndex, itemIndex, newItem);

    if (!item) {
        return null;
    }

    return (
        <div className={`item-wrapper ${selected && 'item-wrapper-selected'}`}>
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
            <TranslationEditor
                description={item?.description}
                updateDescription={console.log}
            />
            <ItemOptions
                item={item}
                updateItem={updateItem}
            />

        </div>
    );
};
