import React, {useContext, useEffect, useState} from 'react';
import { Button, Form, Input, Layout, message, Modal, Popconfirm, Space, Table } from 'antd';

import './styles.css';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import {CoreCtx} from "../../index";
import {createSurvey, deleteSurvey, fetchSurveys} from "../../services/surveyService";
import {Survey} from "../../types";

const { Content } = Layout;

const GDS_ORG_ID = 'b668b413-08c3-46bd-9d71-88feb2b1ac4d';

const handleDeleteSurvey = async (
    userToken: string,
    surveyId: string,
) => {
    const hide = message.loading(`Deleting ${surveyId}..`, 0);

    try {
        await deleteSurvey(userToken, surveyId);
        hide();
        message.success(`${surveyId} got successfully deleted!`);
    } catch (error) {
        hide();
        message.error(`Failed to delete ${surveyId}: ${error.message}`);
    }
};

const handleCreateSurvey = async (
    title: string,
    userToken: string,
    userId: string,
    orgId: string,
    history: any,
) => {
    const hide = message.loading('Creating survey..', 0);
    try {
        const newSurveyId = await createSurvey(title, userId, userToken, orgId);
        hide();
        message.success(`${title} got successfully created!`);
        history.push(`/surveys/${newSurveyId}`);
    } catch (error) {
        hide();
        message.error(`Failed to create ${title}: ${error.message}`);
    }
};

const duplicateSurvey = async (id: string) => {
    const hide = message.loading(`Duplicating survey ${id} ..`, 0);
    try {
        const newSurveyId = await new Promise((
            resolve,
            _reject,
        ) => {
            setTimeout(() => resolve('survey_1'), 3000);
        });
        hide();
        message.success(`${newSurveyId} got successfully duplicated!`);
        // history.push(`/surveys/${newSurveyId}`);
    } catch (error) {
        hide();
        message.error(`Failed to duplicated: ${error.message}`);
    }
};

// const SURVEYS_LIST = [
//     {
//         id: 'survey_1',
//         key: 'survey_1',
//         title: 'Global Drug Survey 2020',
//         responses: 1,
//         updatedAt: 1581635524722,
//         createdAt: 1581615521722,
//     },
//     {
//         id: 'survey_2',
//         key: 'survey_2',
//         title: 'Global Drug Survey 2021 new Platform test',
//         responses: 100100,
//         updatedAt: 1289625564722,
//         createdAt: 1289615561722,
//     },
//     {
//         id: 'survey_3',
//         key: 'survey_3',
//         title: 'Global Drug Survey: The Big UK Cannabis Survey 2019',
//         responses: 222,
//         updatedAt: 1589631564222,
//         createdAt: 1589611561222,
//     },
//     {
//         id: 'survey_4',
//         key: 'survey_4',
//         title: 'Global Drug Survey 2020 - copy',
//         responses: 1235,
//         updatedAt: 1588635562722,
//         createdAt: 1588615561722,
//     },
//     {
//         id: 'survey_4',
//         key: 'survey_4',
//         title: 'Global Drug Survey 2020 - copy - Global Drug Survey 2020 - copy Global Drug Survey 2020 - copy Global Drug Survey 2020 - copy',
//         responses: 1235,
//         updatedAt: 1588635562722,
//         createdAt: 1588615561722,
//     },
// ];

const columns = (
    userToken: string,
) => [
    {
        title: 'Title',
        dataIndex: 'title',
        width: 600,
    },
    // {
    //     title: 'Responses',
    //     dataIndex: 'responses',
    //     sorter: (
    //         a: any,
    //         b: any,
    //     ) => a.responses - b.responses,
    // },
    // {
    //     title: 'Last Edited',
    //     dataIndex: 'updatedAt',
    //     render: (lastUpdated: number) => (
    //         <span>{(new Date(lastUpdated)).toDateString()}</span>
    //     ),
    //     sorter: (
    //         a: any,
    //         b: any,
    //     ) => a.updatedAt - b.updatedAt,
    // },
    // {
    //     title: 'Date created',
    //     dataIndex: 'createdAt',
    //     render: (lastUpdated: number) => (
    //         <span>{(new Date(lastUpdated)).toDateString()}</span>
    //     ),
    //     sorter: (
    //         a: any,
    //         b: any,
    //     ) => a.createdAt - b.createdAt,
    // },
    {
        title: null,
        key: 'action',
        render: (
            text: any,
            record: any,
        ) => (
            <Space size="middle">
                <Popconfirm
                    title={`Duplicate survey ${record.title}`}
                    onConfirm={() => duplicateSurvey(record.id)}
                >
                    <Button>Duplicate</Button>
                </Popconfirm>
                <Link to={`/surveys/${record.id}`}>Edit</Link>
                <Popconfirm
                    title={`Delete survey ${record.title}`}
                    onConfirm={() => handleDeleteSurvey(userToken, record.id)}
                >
                    <Link to="#">Delete</Link>
                </Popconfirm>
            </Space>
        ),
    },
];

const Surveys = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const history = useHistory();
    const [user] = useContext(CoreCtx).user;
    const [userToken] = useContext(CoreCtx).userToken;
    const [surveys, setSurveys] = useState<ReadonlyArray<Survey>>([]);


    const orgId = GDS_ORG_ID;

    useEffect(() => {
        (async () => {
            if (!user?.surveys || !userToken) {

                return;
            }

            // fetch user surveys
            const fetchedSurveys = await fetchSurveys(userToken, user.surveys);

            setSurveys(fetchedSurveys);
        })();
    }, [user?.id    ]);

    if (!userToken || !user) {
        return null;
    }

    const dataSource = surveys.map(survey => ({
        id: survey.id,
        key: survey.id,
        title: survey.meta.name,
        // responses: 1235,
        // updatedAt: 1588635562722,
        // createdAt: 1588615561722,
    }))

    return (
        <Layout className="container-layout">
            <Content>
                <Button onClick={() => setShowAddModal(true)} type="primary" className="create-survey-button">
                    Create a survey
                </Button>
                <Table
                    dataSource={dataSource}
                    columns={columns(userToken)}
                    pagination={false}
                />
                <Modal
                    title="Create survey"
                    visible={showAddModal}
                    onCancel={() => setShowAddModal(false)}
                    footer={null}
                >
                    <h2>What would you like to name this survey?</h2>
                    <Form
                        name="basic"
                        initialValues={{ remember: true }}
                        onFinish={
                            (values: any) => handleCreateSurvey(
                                values.name,
                                user.id,
                                userToken,
                                orgId,
                                history
                            )
                        }
                        onFinishFailed={console.log}
                    >
                        <Form.Item
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    whitespace: true,
                                    message: 'Please input your a valid name for your survey!',
                                },
                            ]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item style={{ textAlign: 'center', marginTop: '60px' }}>
                            <Button type="primary" htmlType="submit" style={{ width: '40%' }}>
                                Create
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </Content>
        </Layout>
    );
};

export default Surveys;
