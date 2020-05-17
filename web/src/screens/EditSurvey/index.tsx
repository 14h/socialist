import React, { useState } from 'react';
import {
    Breadcrumb,
    Divider,
    Dropdown,
    InputNumber,
    Layout,
    Menu,
    Select,
    Switch,
    Tabs,
    Typography
} from 'antd';

import './styles.css';
import { Condition, Question, Survey } from '../../types';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import ReactJson from 'react-json-view';
import { useLocalStorage } from '@utils/helpers';
import { ReactSortable } from "react-sortablejs";

const { TabPane } = Tabs;
const { Content, Sider } = Layout;
const { Title, Text } = Typography;

const SURVEY: Survey = {
    name: 'survey1',
    title: 'survey name',
    pages: [
        {
            name: 'page1',
            title: 'page1',
            conditions: [],
            questions: [
                {
                    type: 'number',
                    name: 'question1',
                    title: 'question title',
                    minValue: 0,
                    maxValue: 10
                },
                {
                    type: 'text',
                    name: 'question2',
                    title: 'question title2',
                    minCharacters: 0,
                    maxCharacters: 10
                }
            ]
        },
        {
            name: 'page2',
            title: 'page2',
            conditions: [],
            questions: [
                {
                    type: 'number',
                    name: 'question21',
                    title: 'question title222',
                    minValue: 0,
                    maxValue: 10
                },
                {
                    type: 'number',
                    name: 'question22',
                    title: 'question title22',
                    minValue: 0,
                    maxValue: 10
                }
            ]
        },
        {
            name: 'page3',
            title: 'page3',
            conditions: [],
            questions: [
                {
                    type: 'number',
                    name: 'question31',
                    title: 'question title222',
                    minValue: 0,
                    maxValue: 10
                },
                {
                    type: 'number',
                    name: 'question32',
                    title: 'question title22',
                    minValue: 0,
                    maxValue: 10
                }
            ]
        }
    ]
};

const translations = [
    {
        key: '00001',
        en: 'Who am I?',
        de: 'Wer bin ich?'
    },
    {
        key: '00002',
        en: 'what am I doing?',
        de: 'Was mache ich?'
    },
]

type SurveyListItem = SurveyListItemPage | Question;
type SurveyListItemPage = {
    type: 'page';
    name: string;
    title: string;
    conditions?: Condition[];
};

const mapSurveyToSurveyList = (survey: Survey): SurveyListItem[] => {
    const surveyListBase: SurveyListItem[] = [];

    for (const page of survey.pages) {
        surveyListBase.push({
            type: 'page',
            name: page.name,
            title: page.title,
            conditions: page.conditions
        });
        surveyListBase.push(...page.questions);
    }
    return surveyListBase;
};

const ItemEdit = ({ item, updateItem, currentLang }: { item: SurveyListItem; updateItem: (item: SurveyListItem) => void; currentLang: string }) => {
    if (item.type === 'page') {
        return (
            <Tabs defaultActiveKey="logic">
                <TabPane tab="Logic" key="logic">
                    Page Logic
                </TabPane>
            </Tabs>
        )
    }

    if (item.type === 'text') {
        const updateMinChars = (minCharacters: number | undefined) => {
            updateItem(
                Object.assign(
                    {},
                    item,
                    {
                        minCharacters,
                    }
                )
            )
        }
        const updateMaxChars = (maxCharacters: number | undefined) => {
            updateItem(
                Object.assign(
                    {},
                    item,
                    {
                        maxCharacters,
                    }
                )
            )
        }
        return (
            <Tabs defaultActiveKey="options">
                <TabPane tab="Options" key="options">
                    <>
                        <div className='option-item'>
                            <span>Min Characters:  </span>
                            <InputNumber defaultValue={item?.minCharacters} onChange={updateMinChars} />
                        </div>
                        <div className='option-item'>
                            <span>Max Characters: </span>
                            <InputNumber defaultValue={item?.minCharacters} onChange={updateMaxChars} />
                        </div>

                    </>
                </TabPane>
                <TabPane tab="Json" key="json">
                    <ReactJson
                        src={item}
                        theme="apathy:inverted"
                        iconStyle="triangle"
                        onEdit={({updated_src}) => updateItem(updated_src as SurveyListItem) }
                    />
                </TabPane>
            </Tabs>
        );
    }

    if (item.type === 'number') {
        const updateMinValue = (minValue: number | undefined) => {
            updateItem(
                Object.assign(
                    {},
                    item,
                    {
                        minValue,
                    }
                )
            )
        }
        const updateMaxValue = (maxValue: number | undefined) => {
            updateItem(
                Object.assign(
                    {},
                    item,
                    {
                        maxValue,
                    }
                )
            )
        }
        return (
            <Tabs defaultActiveKey="edit">
                <TabPane tab="Options" key="options">
                    <>
                        <div className='option-item'>
                            <span>Min Value:  </span>
                            <InputNumber defaultValue={item?.minValue} onChange={updateMinValue} />
                        </div>
                        <div className='option-item'>
                            <span>Max Value: </span>
                            <InputNumber defaultValue={item?.maxValue} onChange={updateMaxValue} />
                        </div>

                    </>
                </TabPane>
                <TabPane tab="Json" key="json">
                    <ReactJson
                        src={item}
                        theme="apathy:inverted"
                        iconStyle="triangle"
                        onEdit={({updated_src}) => updateItem(updated_src as SurveyListItem) }
                    />
                </TabPane>
            </Tabs>
        );
    }

    if (item.type === 'multi') {
        const updateMinOptions = (minOptions: number | undefined) => {
            updateItem(
                Object.assign(
                    {},
                    item,
                    {
                        minOptions,
                    }
                )
            )
        }
        const updateMaxOptions = (maxOptions: number | undefined) => {
            updateItem(
                Object.assign(
                    {},
                    item,
                    {
                        maxOptions,
                    }
                )
            )
        }

        return (
            <Tabs defaultActiveKey="edit">
                <TabPane tab="Edit" key="edit">
                    <div>
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="Please select"
                            defaultValue={[]}
                            onChange={console.log}
                        >
                            {
                                translations.map((t: any, index: number) => (
                                    <Select.Option key={t.key} value={t.key}>
                                        {t[currentLang]}
                                    </Select.Option>
                                ))
                            }
                        </Select>
                    </div>
                </TabPane>
                <TabPane tab="Options" key="options">
                    <>
                        <div className='option-item'>
                            <span>Min Options:  </span>
                            <InputNumber defaultValue={item?.minOptions} onChange={updateMinOptions} />
                        </div>
                        <div className='option-item'>
                            <span>Max Options: </span>
                            <InputNumber defaultValue={item?.maxOptions} onChange={updateMaxOptions} />
                        </div>

                    </>
                </TabPane>
                <TabPane tab="Json" key="json">
                    <ReactJson
                        src={item}
                        theme="apathy:inverted"
                        iconStyle="triangle"
                        onEdit={({updated_src}) => updateItem(updated_src as SurveyListItem) }
                    />
                </TabPane>
            </Tabs>
        );
    }

    if (item.type === 'date') {
        return (
            <Tabs defaultActiveKey="json">
                <TabPane tab="Json" key="json">
                    <ReactJson
                        src={item}
                        theme="apathy:inverted"
                        iconStyle="triangle"
                        onEdit={({updated_src}) => updateItem(updated_src as SurveyListItem) }
                    />
                </TabPane>
            </Tabs>
        );
    }

    return (
      <div/>
    )
}

const EditSurveyListItem = ({item, updateItem, currentLang}: {item: SurveyListItem | undefined; updateItem: (item: SurveyListItem) => void; currentLang: string;}) => {
    if(!item) {
        return null;
    }

    const updateTitle = (title: string) => {
        updateItem(
            Object.assign(
                {},
                item,
                {
                    title
                }
            )
        );
    }

    const updateName = (name: string) => {
        updateItem(
            Object.assign(
                {},
                item,
                {
                    name
                }
            )
        );
    }

    const onChangeType = (type: Question["type"]) => {
        updateItem(
            {
                type,
                name: item.name,
                title: item.title
            }
        )
    }

    return <>
        <div className='edit-surveyListItem-header'>
            <Title level={4} editable={{ onChange: updateTitle }}>{item.title}</Title>

            <Select defaultValue={item?.type as any} value={item?.type as any} style={{ width: 120 }} onChange={onChangeType}>
                <Select.Option value="number">Number</Select.Option>
                <Select.Option value="date">Date</Select.Option>
                <Select.Option value="text">Text</Select.Option>
                <Select.Option value="multi">Multi</Select.Option>
                <Select.Option value="page">Page</Select.Option>
            </Select>
        </div>
        <Text editable={{ onChange: updateName }} style={{maxWidth: 200}}>{item.name}</Text>
        <ItemEdit
            item={item}
            updateItem={updateItem}
            currentLang={currentLang}
        />
    </>
}

const EditSurvey = () => {
    // const [surveyList, setSurveyList] = useState(mapSurveyToSurveyList(SURVEY));
    const [surveyList, setSurveyList] = useLocalStorage('s',mapSurveyToSurveyList(SURVEY));
    const { survey_id, question_index } = useParams();
    const selectedItem: SurveyListItem | null = (question_index && surveyList[parseInt(question_index)]) || null;
    const [jsonEditMode, setJsonEditMode] = useState(false);
    const currentLang = 'en';

    const duplicateItem = (index: number) => {
        const list = surveyList.slice();
        list.splice(
            index + 1,
            0,
            Object.assign(
                {},
                list[index],
                {
                    name: `${list[index].name}_duplicate`
                }
            )
        )
        setSurveyList(list);
    };
    const insertNewItem = (index: number) => {
        const list = surveyList.slice();
        list.splice(index, 0, {name: 'new_item', title: 'New Item, please change name and title', type: 'page'})
        setSurveyList(list);
    };
    const deleteItem = (index: number) => {
        const list = surveyList.slice();
        list.splice(index, 1);
        setSurveyList(list);
    };

    return (
        <>
            <Breadcrumb style={{ margin: '16px 0', textAlign: 'center' }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to="/surveys">Surveys</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to={`/surveys/${survey_id}`}>{survey_id}</Link>
                </Breadcrumb.Item>
                {question_index && (
                    <Breadcrumb.Item>
                        <Link to={`/surveys/${survey_id}/${question_index}`}>{selectedItem?.name}</Link>
                    </Breadcrumb.Item>
                )}
            </Breadcrumb>
            <Layout className="container-layout">
                <Sider width={300}  className='sider'>
                    <div className='sider-actions'>
                        <Switch checked={jsonEditMode} onChange={() => setJsonEditMode(state => !state)} /> edit JSON
                        <Divider type="vertical" />
                        <Switch onChange={console.log} /> some action
                    </div>

                    <ReactSortable list={surveyList} setList={setSurveyList} className='sider-list'>
                        {surveyList.map((item: SurveyListItem, index: number) => (
                            <div
                                className={ `sider-item ${item.type === 'page' && 'sider-item-page'} ${parseInt(question_index || '') === index && 'sider-item-selected'}`}
                                key={`surveyListItem-${index}`}
                            >
                                <Dropdown
                                    overlay={
                                        <Menu>
                                            <Menu.Item onClick={()=>insertNewItem(index)}>
                                                Add Item above
                                            </Menu.Item>
                                            <Menu.Item onClick={()=>insertNewItem(index+1)}>
                                                Add Item bellow
                                            </Menu.Item>
                                            <Menu.Item onClick={()=> duplicateItem(index)}>
                                                Duplicate
                                            </Menu.Item>
                                            <Menu.Item onClick={() => deleteItem(index)}>
                                                Delete Item
                                            </Menu.Item>
                                        </Menu>
                                    }
                                    trigger={['contextMenu']}
                                >
                                    <Link to={`/surveys/${survey_id}/${index}`} onClick={()=>setJsonEditMode(false)}>
                                        <div className="survey-item-option">{item.name}</div>
                                    </Link>
                                </Dropdown>
                            </div>
                        ))}
                    </ReactSortable>
                </Sider>
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Content className="edit-survey-content">
                        {
                            jsonEditMode &&
                            <ReactJson
                              src={SURVEY}
                              theme="apathy:inverted"
                              iconStyle="triangle"
                              onEdit={({updated_src}) => setSurveyList(mapSurveyToSurveyList(updated_src as Survey)) }
                            />
                        }

                        {
                            !jsonEditMode && selectedItem && <EditSurveyListItem
                                item={selectedItem}
                                updateItem={
                                    (newItem: SurveyListItem) =>  {
                                        console.log(newItem)
                                        const newSurveyList = surveyList.slice();
                                        newSurveyList[parseInt(question_index || '')] = newItem
                                        setSurveyList(
                                            newSurveyList
                                        )
                                    }
                                }
                                currentLang={ currentLang }
                            />
                        }

                    </Content>
                </Layout>
            </Layout>
        </>
    );
};

export default EditSurvey;
