import React, { useContext } from 'react';
import {Button, Col, Dropdown, Layout, Menu, message, Row} from 'antd';
import { LogoutOutlined, UserOutlined, UpOutlined } from '@ant-design/icons';
import './styles.css';
import { Link } from 'react-router-dom';
import { CoreCtx } from '../../index';
import {Logo} from "@components/Logo";

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
    const [user, setUser] = useContext(CoreCtx).user;
    console.log(user);


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
                            Your organizations
                        </Col>
                        <Col span={1}>
                            <PlusOutline />
                        </Col>
                    </Row>}
                >
                {
                    user?.organization?.map(
                        org => (
                            <Menu.SubMenu key={org} title={org}>
                                <Menu.Item key="surveys">
                                    <Link to="/surveys">Surveys</Link>
                                </Menu.Item>

                                <Menu.Item key="translations">
                                    <Link to="/translations">Translations</Link>
                                </Menu.Item>

                                <Menu.Item key="people">
                                    <Link to="/people">People</Link>
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
