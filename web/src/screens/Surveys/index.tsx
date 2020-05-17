import React, { useState } from 'react';
import { Breadcrumb, Button, Form, Input, Layout, message, Modal, Popconfirm, Space, Table } from 'antd';

import './styles.css';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';

const { Content } = Layout;

const deleteSurvey = async (id: string) => {
    const hide = message.loading(`Deleting ${id}..`, 0);

    try {
        await new Promise((resolve, _reject) => {
            setTimeout(() => resolve('survey_1'), 3000);
        });
        hide();
        message.success(`${id} got successfully deleted!`);
    } catch(error) {
        hide();
        message.error(`Failed to delete ${id}: ${error.message}`)
    }
}

const createSurvey = async (title: string, history: any) => {
    const hide = message.loading('Creating survey..', 0);
    try {
        const newSurveyId = await new Promise((resolve, _reject) => {
            setTimeout(() => resolve('survey_1'), 3000);
        });
        hide();
        message.success(`${title} got successfully created!`);
        history.push(`/surveys/${newSurveyId}`);
    } catch(error) {
        hide();
        message.error(`Failed to create ${title}: ${error.message}`)
    }
}

const duplicateSurvey = async (id: string) => {
    const hide = message.loading(`Duplicating survey ${id} ..`, 0);
    try {
        const newSurveyId = await new Promise((resolve, _reject) => {
            setTimeout(() => resolve('survey_1'), 3000);
        });
        hide();
        message.success(`${newSurveyId} got successfully duplicated!`);
        // history.push(`/surveys/${newSurveyId}`);
    } catch(error) {
        hide();
        message.error(`Failed to duplicated: ${error.message}`)
    }
}

const SURVEYS_LIST = [
    {
        id: 'survey_1',
        key: 'survey_1',
        title: 'Global Drug Survey 2020',
        responses: 1,
        updatedAt: 1581635524722,
        createdAt: 1581615521722,
    },
    {
        id: 'survey_2',
        key: 'survey_2',
        title: 'Global Drug Survey 2021 new Platform test',
        responses: 100100,
        updatedAt: 1289625564722,
        createdAt: 1289615561722,
    },
    {
        id: 'survey_3',
        key: 'survey_3',
        title: 'Global Drug Survey: The Big UK Cannabis Survey 2019',
        responses: 222,
        updatedAt: 1589631564222,
        createdAt: 1589611561222,
    },
    {
        id: 'survey_4',
        key: 'survey_4',
        title: 'Global Drug Survey 2020 - copy',
        responses: 1235,
        updatedAt: 1588635562722,
        createdAt: 1588615561722,
    },
    {
        id: 'survey_4',
        key: 'survey_4',
        title: 'Global Drug Survey 2020 - copy - Global Drug Survey 2020 - copy Global Drug Survey 2020 - copy Global Drug Survey 2020 - copy',
        responses: 1235,
        updatedAt: 1588635562722,
        createdAt: 1588615561722,
    },
];

const columns = [
    {
        title: 'Title',
        dataIndex: 'title',
        width: 400,
    },
    {
        title: 'Responses',
        dataIndex: 'responses',
        sorter: (a: any, b: any) => a.responses - b.responses,
    },
    {
        title: 'Last Edited',
        dataIndex: 'updatedAt',
        render: (lastUpdated: number) => (
            <span>{(new Date(lastUpdated)).toDateString()}</span>
        ),
        sorter: (a: any, b: any) => a.updatedAt - b.updatedAt,
    },
    {
        title: 'Date created',
        dataIndex: 'createdAt',
        render: (lastUpdated: number) => (
            <span>{(new Date(lastUpdated)).toDateString()}</span>
        ),
        sorter: (a: any, b: any) => a.createdAt - b.createdAt,
    },
    {
        title: null,
        key: 'action',
        render: (_text: any, record: any) => (
            <Space size="middle">
                <Popconfirm
                    title={`Duplicate survey ${record.title}`}
                    onConfirm={() => duplicateSurvey(record.id)}
                >
                    <a>Duplicate</a>
                </Popconfirm>
                <Link to={`/surveys/${record.id}`}>Edit</Link>
                <Popconfirm
                    title={`Delete survey ${record.title}`}
                    onConfirm={() => deleteSurvey(record.id)}
                >
                    <a>Delete</a>
                </Popconfirm>
            </Space>
        ),
    },
];

const Surveys = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const history = useHistory();

    return (
        <Layout className="container-layout">
            <Content>
                <Button onClick={() => setShowAddModal(true)} type="primary" className="create-survey-button">
                    Create a survey
                </Button>
                <Table
                    dataSource={SURVEYS_LIST}
                    columns={columns}
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
                        onFinish={(values: any) => createSurvey(values.title, history)}
                        onFinishFailed={console.log}
                    >
                        <Form.Item
                            name="title"
                            rules={[{
                                required: true,
                                whitespace: true,
                                message: 'Please input your a valid name for your survey!',
                            }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item style={{textAlign: 'center', marginTop: '60px'}} >
                            <Button type="primary" htmlType="submit" style={{width: '40%'}}>
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
