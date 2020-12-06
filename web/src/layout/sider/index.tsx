import React, {useContext, useRef, useState} from 'react';
import {Button, Col, Dropdown, Input, Layout, Menu, message, Popconfirm, Row} from 'antd';
import { LogoutOutlined, PlusOutlined, UpOutlined } from '@ant-design/icons';
import './styles.css';
import { Link } from 'react-router-dom';
import { CoreCtx } from '../../index';
import {Logo} from "@components/Logo";
import {createOrganization} from "../../services/orgService";
import {addResourceUserRoles} from "../../services/surveyService";

const UserOptionsMenu = () => {
    const [, setUser] = useContext(CoreCtx).user;
    const [, setUserToken] = useContext(CoreCtx).userToken;

    return (
        <Menu>
            <Menu.Item
                onClick={() => {
                    setUserToken(null)
                    setUser(null)
                }}
                key="logout"
                icon={<LogoutOutlined />}
            >
                Logout
            </Menu.Item>
        </Menu>
    );
}

export const LayoutSider = () => {
    const selectedMenuItem = window.location.pathname.split('/')[1];
    const [user] = useContext(CoreCtx).user;
    const [userToken] = useContext(CoreCtx).userToken;

    const newOrgNameRef = useRef<Input>(null);

    if (!user || !userToken) {
        return null;
    }


    const handleCreateOrg = async () => {
        const newOrgName = newOrgNameRef?.current?.state?.value;
        if (!newOrgName) {
            message.error('Insert a valid org name!');
        }
        try {
            const newOrgId = await createOrganization(newOrgName, userToken);

            if (!newOrgId) {
                throw new Error('failed to create org!');
            }

            await addResourceUserRoles(
                userToken,
                user.id,
                newOrgId,
                'ORG'
            );

        } catch (error) {
            message.error('failed to create new org')
        }

    }

    return (
        <div className="sider">
            <Link to="/surveys" className="logo">
                <Logo />
            </Link>
            <Menu
                className="sider-menu"
                theme="dark"
                mode="inline"
                defaultSelectedKeys={[selectedMenuItem]}
                defaultOpenKeys={[user?.organization?.[0] ?? '']}
            >
                <Menu.ItemGroup
                    key="orgs"
                    title={<Row justify="space-between">
                        <Col span={11}>
                            Your orgs
                        </Col>
                        <Col span={1}>
                            <Popconfirm
                                placement="right"
                                title={<Input ref={newOrgNameRef} placeholder="organization name" style={{width: '100%'}}/>}
                                icon={null}
                                onConfirm={handleCreateOrg}
                                okText="create Organization"
                                cancelText="cancel"
                            >
                                <PlusOutlined />
                            </Popconfirm>
                            {/*<Link to='/create-org' ><PlusOutlined /></Link>*/}
                        </Col>
                    </Row>}
                >
                    {
                        user?.organization?.map(
                            org => (
                                <Menu.SubMenu key={org} title={org}>
                                    <Menu.Item key="surveys">
                                        <Link to={`/${org}/surveys`}>Surveys</Link>
                                    </Menu.Item>

                                    <Menu.Item key="translations">
                                        <Link to={`/${org}/translations`}>Translations</Link>
                                    </Menu.Item>

                                    <Menu.Item key="people">
                                        <Link to={`/${org}/people`}>People</Link>
                                    </Menu.Item>
                                </Menu.SubMenu>
                            )
                        )
                    }
                </Menu.ItemGroup>
            </Menu>

            <div className='sider-details'>
                <Dropdown overlay={<UserOptionsMenu/>}>
                    <Button
                        onClick={e => e.preventDefault()}
                        className='sider-details-button'
                    >
                        {user?.email ?? ''} <UpOutlined />
                    </Button>
                </Dropdown>
            </div>
        </div>
    );
};
