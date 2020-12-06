import React, { useContext } from 'react';
import { Button, Dropdown, Layout, Menu, message } from 'antd';
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


    return (
        <div className="sider">
            <Link to="/surveys" className="logo">
                <Logo />
            </Link>
            <Menu
                className="sider-menu"
                theme="dark"
                mode="vertical"
                defaultSelectedKeys={[selectedMenuItem]}
            >
                <Menu.Item key="surveys">
                    <Link to="/surveys">Surveys</Link>
                </Menu.Item>

                <Menu.Item key="translations">
                    <Link to="/translations">Translations</Link>
                </Menu.Item>

                <Menu.Item key="people">
                    <Link to="/people">People</Link>
                </Menu.Item>
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
