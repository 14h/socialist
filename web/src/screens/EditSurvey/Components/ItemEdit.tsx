import { ItemFormat } from './ItemFormat';
import { SurveyStore } from '@utils/hooks';
import { Button, Popconfirm, Tabs, Typography } from 'antd';
import { TranslationEditor } from './TranslationEditor';
import { ItemOptions } from './ItemOptions';
import { ItemSettings } from './ItemSettings';
import React from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons/lib';
import { Item, Section, TranslationRef } from '../../../types';
import { ReactSortable } from 'react-sortablejs';


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

    const updateDescription = (description: TranslationRef) => updateItem(Object.assign({}, item, { description }));

    return (
        <div className="item-edit">
            <Tabs>
                <Tabs.TabPane tab="Edit item" key="item">
                    <TranslationEditor
                        description={item.description}
                        updateDescription={updateDescription}
                        onDelete={deleteItem}
                    />

                    <ItemSettings
                        item={item}
                        updateItem={updateItem}
                    />

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
                </Tabs.TabPane>
                <Tabs.TabPane tab="Item Options" key="options">
                    <ItemOptions
                        item={item}
                        updateItem={updateItem}
                    />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Section logic" key="logic">
                </Tabs.TabPane>
                <Tabs.TabPane tab="Sort section items" key="sort">
                    <ReactSortable
                        list={section.items as any[]}
                        setList={((items: Item[]) => surveyStore.updateSection({...section, items})) as any}
                        className="sider-list"
                    >
                        {section.items.map((
                            i: Item,
                            index: number,
                        ) => (
                            <div
                                className="sider-item"
                                key={`surveyListItem-${index}`}
                            >
                                <div className="survey-item-option">{i.name}</div>
                            </div>
                        ))}
                    </ReactSortable>
                </Tabs.TabPane>
            </Tabs>

        </div>
    )
}
