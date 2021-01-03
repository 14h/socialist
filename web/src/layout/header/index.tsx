import React, { useContext } from 'react';
import { Button, Dropdown, Menu } from 'antd';
import { LogoutOutlined, UpOutlined } from '@ant-design/icons';
import './styles.less';
import { Link } from 'react-router-dom';
import { CoreCtx } from '../../index';
import { Logo } from '@components/Logo';

const UserOptionsMenu = () => {
    const { logout } = useContext(CoreCtx);

    return (
        <Menu>
            <Menu.Item
                onClick={ logout }
                key="logout"
                icon={ <LogoutOutlined/> }
            >
                Logout
            </Menu.Item>
        </Menu>
    );
};

export const LayoutHeader = () => {
    const { user, userToken } = useContext(CoreCtx);

    if (!user || !userToken) {
        return null;
    }

    return (
        <div className="header">
            <Link to="/" className="logo">
                <Logo/>
            </Link>


            <div className='sider-details'>
                <Dropdown overlay={ <UserOptionsMenu/> }>
                    <Button
                        onClick={ e => e.preventDefault() }
                        className='sider-details-button'
                    >
                        { user?.email ?? '' } <UpOutlined/>
                    </Button>
                </Dropdown>
            </div>
        </div>
    );
};
