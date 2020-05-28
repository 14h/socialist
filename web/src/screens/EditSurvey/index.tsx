import React from 'react';
import { Button, Layout, Popconfirm, Typography } from 'antd';

import './styles.css';
import { Item, Survey } from '../../types';
import { useParams } from 'react-router';
import { useLocalStorage } from '@utils/helpers';
import { CopyOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ItemOptions } from './ItemOptions';
import { ItemEdit } from './ItemEdit';
import { SURVEY, SurveyListItem } from './types';
import { SurveyActions } from './SurveyActions';
import { ItemFormat, TItemFormat } from './ItemFormat';

const { Title, Text } = Typography;

const mapSurveyToSurveyList = (survey: Survey): SurveyListItem[] => {
    const surveyListBase: SurveyListItem[] = [];

    for (const page of survey.pages) {
        surveyListBase.push({
            type: 'page',
            name: page.name,
            title: page.title,
            conditions: page.conditions,
        });
        surveyListBase.push(...page.questions);
    }
    return surveyListBase;
};

type EditSurveyListItem = {
    item: any;
    updateItem: any;
    currentLang: any;
    deleteItem: any;
    duplicateItem: any;
    index: any;
    addItem: any;
};

const renderItem = (item: any) => {

    return <div>1234</div>

}

const EditSurveyListItem = ({
    item,
    updateItem,
    currentLang,
    deleteItem,
    duplicateItem,
    addItem,
}: EditSurveyListItem) => {
    if (!item) {
        return null;
    }

    const updateTitle = (title: string) =>
        updateItem(Object.assign({}, item, { title }));
    const updateName = (name: string) =>
        updateItem(Object.assign({}, item, { name }));
    const onChangeType = (type: Item['type']) =>
        updateItem({ type, name: item.name, title: item.title });

    return (
        <>
            <div className="item-wrapper">
                <div className="edit-surveyListItem">
                    <div className="edit-surveyListItem-header">
                        <Text editable={{ onChange: updateName }}>{item.name}</Text>

                        <div className="edit-surveyListItem-actions">
                            <ItemFormat callback={onChangeType} className="edit-format">
                                <a href="#">
                                    {item.type}
                                    <EditOutlined/>
                                </a>
                            </ItemFormat>

                            <a href="#" onClick={duplicateItem}>
                                Duplicate <CopyOutlined/>
                            </a>
                            <Popconfirm
                                title="Are you sure?"
                                onConfirm={deleteItem}
                                okText="Delete"
                                cancelText="Cancel"
                            >
                                <a href="#" style={{ color: '#ff4d4faa' }}>
                                    Delete <DeleteOutlined/>
                                </a>
                            </Popconfirm>
                        </div>
                    </div>
                    <ReactQuill
                        theme="snow"
                        value={''}
                        onChange={(content: string) => {
                            console.log(content);
                        }}
                    />
                    {/*<Title level={4} editable={{ onChange: updateTitle }}>{item.title}</Title>*/}

                    <ItemEdit
                        item={item}
                        updateItem={updateItem}
                        currentLang={currentLang}
                    />

                    <ItemOptions item={item} updateItem={updateItem}/>
                </div>
                {renderItem(item)}
            </div>
            <ItemFormat callback={addItem} className="add-new-item">
                <Button>Add item</Button>
            </ItemFormat>
        </>
    );
};

const EditSurvey = () => {
    const surveyListStore: any = useLocalStorage(
        's',
        mapSurveyToSurveyList(SURVEY),
    );
    const [surveyList, setSurveyList] = surveyListStore;
    const { survey_id } = useParams();
    const currentLang = 'en';

    const duplicateItem = (index: number) => {
        const list = surveyList.slice();
        list.splice(
            index + 1,
            0,
            Object.assign({}, list[index], { name: `${list[index].name}_duplicate` }),
        );
        setSurveyList(list);
    };
    const insertNewItem = (
        index: number,
        type: TItemFormat,
    ) => {
        const list = surveyList.slice();
        list.splice(index, 0, {
            name: 'new_item',
            title: 'New Item, please change name and title',
            type,
        });
        setSurveyList(list);
    };
    const deleteItem = (index: number) => {
        const list = surveyList.slice();
        list.splice(index, 1);
        setSurveyList(list);
    };

    console.log('surveyList', surveyList);

    return (
        <>
            <Title className="survey-title">{survey_id}</Title>
            <SurveyActions surveyListStore={surveyListStore}/>
            <Layout className="container-layout">
                {surveyList.map((
                    item: SurveyListItem,
                    index: number,
                ) => (
                    <EditSurveyListItem
                        key={`EditSurveyListItem-${index}`}
                        index={index}
                        item={item}
                        addItem={(type: TItemFormat) => insertNewItem(index + 1, type)}
                        deleteItem={() => deleteItem(index)}
                        duplicateItem={() => duplicateItem(index)}
                        currentLang={currentLang}
                        updateItem={(newItem: SurveyListItem) => {
                            const newSurveyList = surveyList.slice();
                            newSurveyList[index] = newItem;
                            setSurveyList(newSurveyList);
                        }}
                    />
                ))}
            </Layout>
        </>
    );
};

export default EditSurvey;
