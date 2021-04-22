import React, { useContext, useEffect, useState } from 'react';

import './styles.less';

import { Button, Form, Input, Layout, message, Modal, Popconfirm, Space, Table } from 'antd';

import { Link } from 'react-router-dom';
import { CoreCtx } from '../../index';
import { addResourceUserRoles } from '../../services/surveyService';
import { Organization } from '../../types';
import { createOrganization, fetchOrganization } from '../../services/orgService';
import { User } from '../../types/models/User';
import { PlusOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';

const handleDeleteOrg = console.log;


const columns = (
    userToken: string,
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
                <Link to={ `/${ record.id }/surveys` }>Surveys</Link>
                <Link to={ `/${ record.id }/translations` }>Translations</Link>
                <Link to={ `/${ record.id }/people` }>People</Link>
                <Link to={ `/organizations/${ record.id }` }>Settings</Link>
                <Popconfirm
                    title={ `Delete organization ${ record.title }` }
                    onConfirm={ () => handleDeleteOrg(userToken, record.id) }
                >
                    <Link to="#">Delete</Link>
                </Popconfirm>
            </Space>
        ),
    },
];

const handleCreateOrg = async (
    name: string,
    user: User,
    userToken: string,
    callback: (newOrgName: string) => void,
) => {
    if (!name) {
        message.error('Insert a valid org name!');
    }
    try {
        const newOrgName = await createOrganization(name, userToken);

        if (!newOrgName) {
            throw new Error('failed to create org!');
        }

        await addResourceUserRoles(
            userToken,
            user.id,
            newOrgName,
            'ORG',
        );

        callback(newOrgName);

    } catch (error) {
        message.error('failed to create new org');
    }

};

type Props = {};

const AddOrgModal = () => {
    const { user, userToken } = useContext(CoreCtx);
    const [showAddModal, setShowAddModal] = useState(false);
    const history = useHistory();

    if (!user || !userToken) {
        return null;
    }

    return (
        <>
            <div
                onClick={ () => setShowAddModal(true) }
                className="create-button"
            >
                <PlusOutlined/>
            </div>
            <Modal
                title="Create Organization"
                visible={ showAddModal }
                onCancel={ () => setShowAddModal(false) }
                footer={ null }
            >
                <Form
                    name="basic"
                    initialValues={ { remember: true } }
                    onFinish={
                        (values: any) => handleCreateOrg(
                            values.name,
                            user,
                            userToken,
                            (newOrgName) => {
                                setShowAddModal(false);
                                history.push(`/${ newOrgName }/surveys`);
                            },
                        )
                    }
                    onFinishFailed={ console.log }
                >
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={ [
                            {
                                required: true,
                                whitespace: true,
                                message: 'Please input your a valid name for your organization!',
                            },
                        ] }
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
        </>
    )
};

export const Organizations: React.FC<Props> = () => {

    const { user, userToken } = useContext(CoreCtx);
    const [orgs, setOrgs] = useState<ReadonlyArray<Organization>>([]);

    useEffect(() => {
        (async () => {
            if (!userToken) {
                return;
            }

            const fetchedOrgs = [];
            for (const userOrgName of user?.organization ?? []) {
                const fetchedOrg = await fetchOrganization(userOrgName, userToken);
                fetchedOrgs.push(fetchedOrg);
            }

            setOrgs(fetchedOrgs);
        })();
    }, [user, userToken]);

    if (!userToken || !user) {
        return null;
    }

    const dataSource = orgs.map(org => ({
        id: org.meta.name,
        key: org.meta.name,
        title: org.meta.name,
    }));

    if (orgs.length === 0) {
        return <Layout>
            <div>
                Click on the plus button to create your first organisation!
            </div>
            <AddOrgModal/>
        </Layout>
    }

    return <div className="table">
        <Layout>
            <Layout.Content>
                <Table
                    dataSource={ dataSource }
                    columns={ columns(userToken) }
                    pagination={ false }
                    showHeader={ false }
                />
            </Layout.Content>
        </Layout>
        <AddOrgModal/>
    </div>;
};
