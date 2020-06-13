import React, { useContext, useState } from 'react';
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
import { ItemFormat } from './ItemFormat';
import { SurveyStore, TranslationsStore, useSurvey, useTranslations } from './hooks';
import { renderItem } from './renderItem';
import { useLocalStorage } from '@utils/helpers';

const { Title, Text } = Typography;

type ItemComponentProps = {
    item: any;
    index: number;
};
const ItemComponent = (props: ItemComponentProps) => {
    const {
        item,
        index,
    } = props;
    const {
        translationsStore,
        surveyStore,
    } = useContext(surveyCtx);

    const currentLang = 'en';

    const translation = translationsStore.getTranslation(item?.translationId);
    const setTranslation = (content: string) => translationsStore.setTranslation({
        key: item.translationId,
        en: content
    });
    const addItem = (type: Item['type']) => surveyStore.insertNewItem(index + 1, type)
    const deleteItem = () => surveyStore.deleteItem(index);
    const duplicateItem = () => surveyStore.duplicateItem(index);
    const updateItem = (newItem: Item) => surveyStore.updateItem(newItem, index);
    const updateName = (name: string) => updateItem(Object.assign({}, item, { name }));
    const onChangeType = (type: Item['type']) => updateItem({ type, name: item.name, translationId: item.translationId });

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

type SurveyCtx = {
    surveyStore: SurveyStore;
    translationsStore: TranslationsStore;
    themeStore: any;
}
export const surveyCtx = React.createContext<SurveyCtx>(null as never);

const EditSurvey = () => {
    const { survey_id } = useParams();
    const surveyStore = useSurvey(survey_id);
    const translationsStore = useTranslations();
    const themeStore = useLocalStorage(
        '24p_theme',
        {
            background: '#000',
            h1: '#FFF',
            h2: '#FFF',
            h3: '#FFF',
            h4: '#FFF',
            h5: '#FFF',
            h6: '#FFF',
        }
    );
    const [theme] = themeStore;

    const surveyCtxValue = {
        surveyStore,
        translationsStore,
        themeStore,
    };

    return (
        <surveyCtx.Provider value={surveyCtxValue}>
            <div className="survey-wrapper">
                <Title className="survey-title">{survey_id}</Title>
                <SurveyActions />
                <Layout
                    style={{background: theme.background}}
                >
                    {surveyStore.items.map((item: Item, index: number) => (
                        <ItemComponent
                            key={`EditSurveyListItem-${index}`}
                            item={item}
                            index={index}
                        />
                    ))}
                </Layout>
            </div>
        </surveyCtx.Provider>
    );
};

export default EditSurvey;
