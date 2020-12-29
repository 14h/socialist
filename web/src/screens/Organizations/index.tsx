import React, { useContext, useEffect, useState } from 'react';

import './styles.less';

import { Button, Form, Input, message, Modal, Popconfirm, Space, Table } from 'antd';

import { Link } from 'react-router-dom';
import { CoreCtx } from '../../index';
import { addResourceUserRoles } from '../../services/surveyService';
import { Organization } from '../../types';
import { createOrganization, fetchOrganization } from '../../services/orgService';
import { User } from '../../types/models/User';
import { meApi } from '../../services/userService';
import { PlusOutlined } from '@ant-design/icons';

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
                <Link to={ `/organizations/${ record.id }` }>Edit</Link>
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
    callback: () => void,
) => {
    if (!name) {
        message.error('Insert a valid org name!');
    }
    try {
        const newOrgId = await createOrganization(name, userToken);

        if (!newOrgId) {
            throw new Error('failed to create org!');
        }

        await addResourceUserRoles(
            userToken,
            user.id,
            newOrgId,
            'ORG',
        );

        callback();

    } catch (error) {
        message.error('failed to create new org');
    }

};

type Props = {};

export const Organizations: React.FC<Props> = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [user, setUser] = useContext(CoreCtx).user;
    const [userToken] = useContext(CoreCtx).userToken;
    const [orgs, setOrgs] = useState<ReadonlyArray<Organization>>([]);

    const userId = user?.id;

    useEffect(() => {
        (async () => {
            if (!userToken) {
                return;
            }

            // Re-fetching user to insure we have all the orgs created recently
            const fetchedUser = await meApi(userToken);

            if (!fetchedUser) {
                throw new Error('me endpoint didn\'t work ');
            }

            setUser(fetchedUser);

            const fetchedOrgs = [];
            for (const userOrgName of fetchedUser?.organization ?? []) {
                const fetchedOrg = await fetchOrganization(userOrgName, userToken);
                fetchedOrgs.push(fetchedOrg);
            }

            setOrgs(fetchedOrgs);
        })();
    }, [userId, showAddModal]);


    if (!userToken || !user) {
        return null;
    }


    const dataSource = orgs.map(org => ({
        id: org.id,
        key: org.id,
        title: org.meta.name,
    }));

    return <div className="table">

        <div
            onClick={ () => setShowAddModal(true) }
            className="create-button"
        >
            <PlusOutlined/>
        </div>
        <Table
            dataSource={ dataSource }
            columns={ columns(userToken) }
            pagination={ false }
        />
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
                        () => setShowAddModal(false),
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

    </div>;
};

