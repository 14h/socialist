import { SurveyStore } from '@utils/hooks';
import { Item, TranslationRef } from '../../../types';
import { ItemFormat } from './ItemFormat';
import { Button, Popconfirm, Tabs, Typography } from 'antd';
import { ItemSettings } from './ItemSettings';
import { renderItem } from './renderItem';
import React, { useContext } from 'react';
import { CopyOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { TranslationEditor } from './TranslationEditor';
import ReactQuill from 'react-quill';
import { CoreCtx } from '../../../index';
import { ItemOptions } from './ItemOptions';
const { Text } = Typography;

type ItemComponentProps = {
    item: Item;
    itemIndex: number;
    pageIndex: number;
    surveyStore: SurveyStore;
    insertNewItemCallback: (type: Item["type"]) => any;
};
export const SectionItem = (props: ItemComponentProps) => {
    const {
        item,
        itemIndex,
        pageIndex,
        surveyStore,
        insertNewItemCallback,
    } = props;
    const [translations] = useContext(CoreCtx).translations;

    const currentLang = 'en';

    const translation = item?.description ? translations.get(item?.description) : {};
    const content = translation?.[currentLang];

    const deleteItem = () => surveyStore.deleteItem(pageIndex, itemIndex);
    const updateItem = (newItem: Item) => surveyStore.updateItem(pageIndex, itemIndex, newItem);
    const updateName = (name: string) => updateItem(Object.assign({}, item, { name }));
    const updateDescription = (description: TranslationRef) => updateItem(Object.assign({}, item, { description }));
    const onChangeType = (type: Item['type']) => updateItem({ type, name: item.name, description: item.description });

    if (!item) {
        return null;
    }

    return (
        <>
            <div className="item-wrapper">
                <div className="item-edit">
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
                <div
                    key={item.name}
                    className='item-preview'
                >
                    <label htmlFor={item.name}>
                        <ReactQuill
                            value={content || ''}
                            readOnly={true}
                            theme={"bubble"}
                        />
                    </label>
                    {renderItem(item)}
                </div>

            </div>
            <ItemFormat callback={insertNewItemCallback} className="add-new-item">
                <Button>Add item</Button>
            </ItemFormat>
        </>
    );
};
