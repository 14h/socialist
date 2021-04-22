import React, { useContext, useState } from 'react';
import { Breadcrumb, Button, Form, Input, message, Modal, Popconfirm, Space, Table } from 'antd';

import './styles.less';
import { Link } from 'react-router-dom';
import { useHistory, useParams } from 'react-router';
import { CoreCtx } from '../../index';
import { createSurvey, deleteSurvey, fetchSurveys } from '../../services/surveyService';
import { HomeOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { useSurveys } from '@utils/hooks';
import { CreateSurveyModal } from '@components/Modals';

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
    const {user, userToken} = useContext(CoreCtx);

    const surveys = useSurveys(orgName);

    if (!userToken || !orgName || !user) {
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

    if (surveys.length === 0) {
        return (
            <>
                <Breadcrumb>
                    <Breadcrumb.Item href="">
                        <HomeOutlined />
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="">
                        <span>{ orgName }</span>
                    </Breadcrumb.Item>
                    <span>Surveys</span>
                </Breadcrumb>
                <CreateSurveyModal/>
                Click on the plus button to create your first Survey!
            </>
        );
    }

    return (
        <div className="table">
            <Breadcrumb>
                <Breadcrumb.Item href="">
                    <HomeOutlined />
                </Breadcrumb.Item>
                <UserOutlined />
                <span>Application List</span>
                <Breadcrumb.Item>Application</Breadcrumb.Item>
            </Breadcrumb>
            <CreateSurveyModal/>
            <Table
                dataSource={ dataSource }
                columns={ columns(userToken, orgName) }
                pagination={ false }
            />
        </div>
    );
};
