import React, { useContext } from 'react';
import { Breadcrumb, message, Popconfirm, Space, Table } from 'antd';

import './styles.less';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import { CoreCtx } from '../../index';
import { HomeOutlined } from '@ant-design/icons';
import { SurveyStore, useSurvey } from '@utils/hooks';
import { EditableText } from '@components/EditableText';


const columns = (
    userToken: string,
    orgName: string,
    surveyStore: SurveyStore,
) => [
    {
        title: 'Title',
        dataIndex: 'title',
        width: '90%',
        render: (
            text: any,
            record: any,
        ) => (
            <EditableText
                text={ text }
                placeholder="Name this section!"
                onUpdate={ console.log }
            />
        )
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
                    onConfirm={ () => surveyStore.deleteSection(record.id) }
                >
                    <Link to="#">Delete</Link>
                </Popconfirm>
            </Space>
        ),
    },
];

const PageBreadcrumbs = ({orgName, surveyName}: {orgName: string, surveyName: string}) => (
    <Breadcrumb>
        <Breadcrumb.Item href="">
            <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="">
            <span>{ orgName }</span>
        </Breadcrumb.Item>
        <span>Surveys</span>
        <Breadcrumb.Item href="">
            <span>{ surveyName }</span>
        </Breadcrumb.Item>
    </Breadcrumb>
);

export const SurveySectionList = () => {
    const { orgName, survey_id } = useParams();
    const {user, userToken} = useContext(CoreCtx);

    const surveyStore = useSurvey(
        userToken,
        survey_id,
        user,
    );

    const survey = surveyStore.value;

    if (!userToken || !orgName || !user) {
        return null;
    }

    const dataSource = survey.sections.map(section => ({
        id: section.name,
        key: section.name,
        title: section.name,
    }));

    if (survey.sections.length === 0) {
        return (
            <>
                <PageBreadcrumbs orgName={ orgName } surveyName={ survey.meta.name } />
                Click on the plus button to create your first Section!
            </>
        );
    }

    return (
        <div className="table">
            <PageBreadcrumbs orgName={ orgName } surveyName={ survey.meta.name } />
            <Table
                dataSource={ dataSource }
                columns={ columns(userToken, orgName, surveyStore) }
                pagination={ false }
            />
        </div>
    );
};
