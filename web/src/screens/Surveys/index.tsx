import React, { useState } from 'react';
import { Breadcrumb, Button, Layout, Modal, Popconfirm, Space, Table } from 'antd';

import './styles.css';
import { Link } from 'react-router-dom';

const { Content } = Layout;

const deleteSurvey = (id: string) => {
    console.log(`Survey with id ${id} has been deleted`)
}

const SURVEYS_LIST = [
    {
        id: 'survey_1',
        key: 'survey_1',
        title: 'Global Drug Survey 2020',
        responses: 1,
        lastEdited: 1581635524722,
    },
    {
        id: 'survey_2',
        key: 'survey_2',
        title: 'Global Drug Survey 2021 new Platform test',
        responses: 100100,
        lastEdited: 1289625564722,
    },
    {
        id: 'survey_3',
        key: 'survey_3',
        title: 'Global Drug Survey: The Big UK Cannabis Survey 2019',
        responses: 222,
        lastEdited: 1589631564222,
    },
    {
        id: 'survey_4',
        key: 'survey_4',
        title: 'Global Drug Survey 2020 - copy',
        responses: 1235,
        lastEdited: 1588635562722,
    },
    {
        id: 'survey_4',
        key: 'survey_4',
        title: 'Global Drug Survey 2020 - copy - Global Drug Survey 2020 - copy Global Drug Survey 2020 - copy Global Drug Survey 2020 - copy',
        responses: 1235,
        lastEdited: 1588635562722,
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
        dataIndex: 'lastEdited',
        render: (lastUpdated: number) => {
            console.log(lastUpdated)
            const date = new Date(lastUpdated);
            console.log(date.getDate())
            return (
                <span>{date.toDateString()}</span>
            )
        },
        sorter: (a: any, b: any) => a.lastEdited - b.lastEdited,
    },
    {
        title: null,
        key: 'action',
        render: (_text: any, _record: any) => (
            <Space size="middle">
                <Link to={`/surveys/${_record.id}`}>Edit</Link>
                <Popconfirm
                    title={`Delete survey ${_record.title}`}
                    onConfirm={() => deleteSurvey(_record.id)}
                >
                    <a>Delete</a>
                </Popconfirm>
            </Space>
        ),
    },
];
const Surveys = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    return (
        <Layout className="surveys-container-layout">
            <Breadcrumb className="breadcrumb">
                <Breadcrumb.Item>
                    <Link to="/">Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Surveys</Breadcrumb.Item>
            </Breadcrumb>
            <Content className="surveys-container-content">
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
                    onOk={console.log}
                    onCancel={() => setShowAddModal(false)}
                >
                    <h2>What would you like to name this survey?</h2>
                </Modal>
                {/*<List*/}
                {/*    itemLayout="horizontal"*/}
                {/*    dataSource={SURVEYS_LIST}*/}
                {/*    renderItem={item => (*/}
                {/*        <List.Item*/}
                {/*            actions={[*/}
                {/*                <Link to={`/surveys/${item.id}`} key="survey-edit">*/}
                {/*                    Edit*/}
                {/*                </Link>,*/}
                {/*                <a key="survey-item-delete">Delete</a>,*/}
                {/*            ]}*/}
                {/*        >*/}
                {/*            <List.Item.Meta*/}
                {/*                title={<span>{item.title}</span>}*/}
                {/*                description={item.id}*/}
                {/*            />*/}
                {/*        </List.Item>*/}
                {/*    )}*/}
                {/*/>*/}
            </Content>
        </Layout>
    );
};

export default Surveys;
