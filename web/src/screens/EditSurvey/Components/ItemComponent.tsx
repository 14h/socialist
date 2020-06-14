import { SurveyStore, TranslationsStore } from '@utils/hooks';
import { Item } from '../../../types';
import { ItemFormat } from './ItemFormat';
import { Button, Popconfirm, Tabs, Typography } from 'antd';
import { ItemOptions } from './ItemOptions';
import { renderItem } from './renderItem';
import React from 'react';
import { CopyOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { TranslationEditor } from './TranslationEditor';
import ReactQuill from 'react-quill';
const { Text } = Typography;

type ItemComponentProps = {
    item: any;
    itemIndex: number;
    pageIndex: number;
    translationsStore: TranslationsStore;
    surveyStore: SurveyStore;
};
export const ItemComponent = (props: ItemComponentProps) => {
    const {
        item,
        itemIndex,
        pageIndex,
        translationsStore,
        surveyStore,
    } = props;

    const currentLang = 'en';

    const translation = translationsStore.getTranslation(item?.name);
    const setTranslation = (content: string) => translationsStore.setTranslation({
        key: item.name,
        en: content
    });
    const addItem = (type: Item['type']) => surveyStore.insertNewItem(pageIndex, itemIndex + 1, type)
    const deleteItem = () => surveyStore.deleteItem(pageIndex, itemIndex);
    const duplicateItem = () => surveyStore.duplicateItem(pageIndex, itemIndex);
    const updateItem = (newItem: Item) => surveyStore.updateItem(pageIndex, itemIndex, newItem);
    const updateName = (name: string) => updateItem(Object.assign({}, item, { name }));
    const onChangeType = (type: Item['type']) => updateItem({ type, name: item.name, title: item.title });

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

                            <Button
                                onClick={duplicateItem}
                                type="link"
                            >
                                Duplicate<CopyOutlined/>
                            </Button>
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
                                value={translation}
                                name={item.name}
                                onChange={setTranslation}
                                updateName={updateName}
                                translations={translationsStore.translations}
                            />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Options" key="options">
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Settings" key="settings">
                            <ItemOptions
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
                            value={translation}
                            readOnly={true}
                            theme={"bubble"}
                        />
                    </label>
                    {renderItem(item)}
                </div>

            </div>
            <ItemFormat callback={addItem} className="add-new-item">
                <Button>Add item</Button>
            </ItemFormat>
        </>
    );
};
