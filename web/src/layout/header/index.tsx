import React, { useContext } from 'react';
import { Button, Dropdown, Layout, Menu } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import './styles.css';
import { Link } from 'react-router-dom';
import { CoreCtx } from '../../index';

const { Header } = Layout;

const UserOptionsMenu = () => {
    const [user, setUser] = useContext(CoreCtx).user;

    return (
        <>
            <Button onClick={() => null}>
                {user?.email}
            </Button>
            <Button onClick={() => setUser(null)}>
                <LogoutOutlined/> LOGOUT
            </Button>
        </>
    );
};

export const LayoutHeader = () => {
    const selectedMenuItem = window.location.pathname.split('/')[1];

    return (
        <Header className="header">
            <Link to="/" className="logo left">
                <img
                    src={
                        'https://www.globaldrugsurvey.com/wp-content/themes/globaldrugsurvey/assets/img/logomark.svg'
                    }
                    alt="GDS"
                />
            </Link>
            <Dropdown className="user-options" overlay={<UserOptionsMenu/>}>
                <Button className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                    <UserOutlined className="user-outlined-icon"/>
                </Button>
            </Dropdown>
            <Menu
                className="header-menu"
                theme="dark"
                mode="horizontal"
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
        </Header>
    );
};
