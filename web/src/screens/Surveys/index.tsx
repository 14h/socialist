import React, { useContext } from 'react';
import { Breadcrumb, message, Popconfirm, Space, Table } from 'antd';

import './styles.less';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import { CoreCtx } from '../../index';
import { deleteSurvey } from '../../services/surveyService';
import { HomeOutlined } from '@ant-design/icons';
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

const PageBreadcrumbs = ({orgName}: {orgName: string}) => (
    <Breadcrumb>
        <Breadcrumb.Item href="">
            <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="">
            <span>{ orgName }</span>
        </Breadcrumb.Item>
        <span>Surveys</span>
    </Breadcrumb>
);

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
    }));

    if (surveys.length === 0) {
        return (
            <>
                <PageBreadcrumbs orgName={ orgName } />
                <CreateSurveyModal/>
                Click on the plus button to create your first Survey!
            </>
        );
    }

    return (
        <div className="table">
            <PageBreadcrumbs orgName={ orgName } />
            <CreateSurveyModal/>
            <Table
                dataSource={ dataSource }
                columns={ columns(userToken, orgName) }
                pagination={ false }
            />
        </div>
    );
};
