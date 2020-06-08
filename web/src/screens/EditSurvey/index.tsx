import React from 'react';
import { Button, Layout, Popconfirm, Tabs, Typography } from 'antd';

import './styles.css';
import { Item } from '../../types';
import { useParams } from 'react-router';
import { CopyOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ItemOptions } from './ItemOptions';
import { ItemEdit } from './ItemEdit';
import { SurveyActions } from './SurveyActions';
import { ItemFormat, TItemFormat } from './ItemFormat';
import { useSurvey, useTranslations } from './hooks';
import { renderItem } from './renderItem';

const { Title, Text } = Typography;

type ItemComponentProps = {
    item: any;
    updateItem: any;
    currentLang: any;
    deleteItem: any;
    duplicateItem: any;
    addItem: any;
    translation: any;
    setTranslation: any;
};
const ItemComponent = (props: ItemComponentProps) => {
    const {
        item,
        updateItem,
        currentLang,
        deleteItem,
        duplicateItem,
        addItem,
        translation,
        setTranslation,
    } = props;

    if (!item) {
        return null;
    }

    const updateName = (name: string) =>
        updateItem(Object.assign({}, item, { name }));
    const onChangeType = (type: Item['type']) =>
        updateItem({ type, name: item.name, translationId: item.translationId });

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
                            <ReactQuill
                                theme="snow"
                                value={translation}
                                onChange={setTranslation}
                                // modules={{
                                //     ImageResize: {
                                //         modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
                                //     }
                                // }}
                            />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Options" key="options">
                            <ItemEdit
                                item={item}
                                updateItem={updateItem}
                                currentLang={currentLang}
                            />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Settings" key="settings">
                            <ItemOptions item={item} updateItem={updateItem}/>
                        </Tabs.TabPane>
                    </Tabs>
                </div>
                {renderItem(item, translation)}
            </div>
            <ItemFormat callback={addItem} className="add-new-item">
                <Button>Add item</Button>
            </ItemFormat>
        </>
    );
};

const EditSurvey = () => {
    const { survey_id } = useParams();
    const surveyStore = useSurvey(survey_id);
    const translationsStore = useTranslations();
    const currentLang = 'en';

    return (
        <>
            <Title className="survey-title">{survey_id}</Title>
            <SurveyActions surveyStore={surveyStore}/>
            <Layout>
                {surveyStore.items.map((
                    item: Item,
                    index: number,
                ) => (
                    <ItemComponent
                        key={`EditSurveyListItem-${index}`}
                        item={item}
                        translation={translationsStore.getTranslation(item?.translationId)}
                        setTranslation={(content: string) =>
                            translationsStore.setTranslation({
                                key: item.translationId,
                                en: content
                            })
                        }
                        addItem={(type: TItemFormat) =>
                            surveyStore.insertNewItem(index + 1, type)
                        }
                        deleteItem={() => surveyStore.deleteItem(index)}
                        duplicateItem={() => surveyStore.duplicateItem(index)}
                        currentLang={currentLang}
                        updateItem={() => surveyStore.updateItem(item, index)}
                    />
                ))}
            </Layout>
        </>
    );
};

export default EditSurvey;
