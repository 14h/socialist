import { ItemFormat } from './ItemFormat';
import { SurveyStore } from '@utils/hooks';
import { Button, Popconfirm, Tabs, Typography } from 'antd';
import { TranslationEditor } from './TranslationEditor';
import { ItemOptions } from './ItemOptions';
import { ItemSettings } from './ItemSettings';
import React from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons/lib';
import { Item, Section, TranslationRef } from '../../../types';
import { SectionActions } from './SectionActions';
const { Text } = Typography;

type TProps = {
    section: Section;
    itemIndex: number;
    sectionIndex: number;
    surveyStore: SurveyStore;
};


export const ItemEdit = (props: TProps) => {
    const {
        section,
        itemIndex,
        sectionIndex,
        surveyStore,
    } = props;

    const item = surveyStore.getItem(sectionIndex, itemIndex);
    const deleteItem = () => surveyStore.deleteItem(sectionIndex, itemIndex);
    const updateItem = (newItem: Item) => surveyStore.updateItem(sectionIndex, itemIndex, newItem);
    const updateName = (name: string) => updateItem(Object.assign({}, item, { name }));
    const updateDescription = (description: TranslationRef) => updateItem(Object.assign({}, item, { description }));
    const onChangeType = (type: Item['type']) => updateItem({ type, name: item.name, description: item.description });

    return (
        <div className="item-edit">
            
            <SectionActions
                section={section}
                updateSection={surveyStore.updateSection}
            />
            <div className="item-header">
                <Text editable={{ onChange: updateName }}>{item.name}</Text>

                <div className="item-actions">
                    <ItemFormat callback={onChangeType} className="edit-format">
                        <Button
                            type="link"
                        >
                            {item.type}
                            <EditOutlined/>
                        </Button>
                    </ItemFormat>

                    <Popconfirm
                        title="Are you sure?"
                        onConfirm={deleteItem}
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
            </div>
            <Tabs>
                <Tabs.TabPane tab="Content" key="content">
                    <TranslationEditor
                        description={item.description}
                        updateDescription={updateDescription}
                        onDelete={deleteItem}
                    />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Options" key="options">
                    <ItemOptions
                        item={item}
                        updateItem={updateItem}
                    />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Settings" key="settings">
                    <ItemSettings
                        item={item}
                        updateItem={updateItem}
                    />
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
}
