import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, Input, message, Modal, Popconfirm, Space, Table } from 'antd';

import './styles.less';
import { Link } from 'react-router-dom';
import { useHistory, useParams } from 'react-router';
import { CoreCtx } from '../../index';
import { createSurvey, deleteSurvey, fetchSurveys } from '../../services/surveyService';
import { Survey } from '../../types';
import { fetchOrganization } from '../../services/orgService';
import { PlusOutlined } from '@ant-design/icons';

const handleDeleteSurvey = async (
    userToken: string,
    surveyId: string,
) => {
    const hide = message.loading(`Deleting ${ surveyId }..`, 0);

    try {
        await deleteSurvey(userToken, surveyId);
        hide();
        message.success(`${ surveyId } got successfully deleted!`);
    } catch (error) {
        hide();
        message.error(`Failed to delete ${ surveyId }: ${ error.message }`);
    }
};

const handleCreateSurvey = async (
    title: string,
    userToken: string,
    userId: string,
    orgName: string,
    history: any,
) => {
    const hide = message.loading('Creating survey..', 0);
    try {
        const newSurveyId = await createSurvey(title, userId, userToken, orgName);

        if (!newSurveyId) {
            message.error(`Survey couldn't be created!`);

            return;
        }

        hide();

        message.success(`${ title } got successfully created!`);

        history.push(`/${ orgName }/surveys/${ newSurveyId }`);
    } catch (error) {
        hide();
        message.error(`Failed to create ${ title }: ${ error.message }`);
    }
};


const columns = (
    userToken: string,
    orgName: string,
) => [
    {
        title: 'Title',
        dataIndex: 'title',
        width: '90%',
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
                <Link to={ `/${ orgName }/surveys/${ record.id }` }>Edit</Link>
                <Popconfirm
                    title={ `Delete survey ${ record.title }` }
                    onConfirm={ () => handleDeleteSurvey(userToken, record.id) }
                >
                    <Link to="#">Delete</Link>
                </Popconfirm>
            </Space>
        ),
    },
];

export const Surveys = () => {
    const { orgName } = useParams();
    const [showAddModal, setShowAddModal] = useState(false);
    const history = useHistory();
    const [user] = useContext(CoreCtx).user;
    const [userToken] = useContext(CoreCtx).userToken;
    const [surveys, setSurveys] = useState<ReadonlyArray<Survey>>([]);


    useEffect(() => {
        (async () => {
            if (!orgName || !userToken) {
                return;
            }

            try {

                const org = await fetchOrganization(orgName, userToken);
                if (!org?.surveys || !userToken) {

                    return;
                }

                // fetch user surveys
                const fetchedSurveys = await fetchSurveys(userToken, org.surveys.map(({ id }) => id));

                setSurveys(fetchedSurveys);

            } catch (err) {
                message.error(JSON.stringify(err?.message));
            }

        })();
    }, [user, orgName]);

    if (!userToken || !user || !orgName) {
        return null;
    }

    const dataSource = surveys.map(survey => ({
        id: survey.id,
        key: survey.id,
        title: survey.meta.name,

        // responses: 1235,
        // updatedAt: 1588635562722,
        // createdAt: 1588615561722,
    }));

    return (
        <div className="table">
            <div
                onClick={ () => setShowAddModal(true) }
                className="create-button"
            >
                <PlusOutlined/>
            </div>

            <Table
                dataSource={ dataSource }
                columns={ columns(userToken, orgName) }
                pagination={ false }
            />
            <Modal
                title="Create survey"
                visible={ showAddModal }
                onCancel={ () => setShowAddModal(false) }
                footer={ null }
            >
                <Form
                    name="basic"
                    initialValues={ { remember: true } }
                    onFinish={
                        (values: any) => handleCreateSurvey(
                            values.name,
                            user.id,
                            userToken,
                            orgName,
                            history,
                        )
                    }
                    onFinishFailed={ console.log }
                >
                    <Form.Item
                        name="name"
                        rules={ [
                            {
                                required: true,
                                whitespace: true,
                                message: 'Please input your a valid name for your survey!',
                            },
                        ] }
                        label="name"
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item style={ { textAlign: 'center', marginTop: '60px' } }>
                        <Button type="primary" htmlType="submit" style={ { width: '40%' } }>
                            Create
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

