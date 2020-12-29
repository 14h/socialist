import React, { useContext } from 'react';
import { Button, Dropdown, Menu } from 'antd';
import { LogoutOutlined, UpOutlined } from '@ant-design/icons';
import './styles.less';
import { Link } from 'react-router-dom';
import { CoreCtx } from '../../index';
import { Logo } from '@components/Logo';

const UserOptionsMenu = () => {
    const [, setUser] = useContext(CoreCtx).user;
    const [, setUserToken] = useContext(CoreCtx).userToken;

    return (
        <Menu>
            <Menu.Item
                onClick={ () => {
                    setUserToken(null);
                    setUser(null);
                } }
                key="logout"
                icon={ <LogoutOutlined/> }
            >
                Logout
            </Menu.Item>
        </Menu>
    );
};

export const LayoutSider = () => {
    const selectedOrg = window.location.pathname.split('/')?.[1] ?? null;
    const subSection = window.location.pathname.split('/')?.[2] ?? null;

    const [user] = useContext(CoreCtx).user;
    const [userToken] = useContext(CoreCtx).userToken;

    if (!user || !userToken) {
        return null;
    }

    console.log(`${ user?.organization?.[0] }-${ subSection }`)

    return (
        <div className="sider">
            <Link to="/" className="logo">
                <Logo/>
            </Link>
            <Menu
                className="sider-menu"
                theme="dark"
                mode="inline"
                defaultSelectedKeys={ [`${ selectedOrg }-${ subSection }`] }
                defaultOpenKeys={ [user?.organization?.[0] ?? ''] }
            >

                <Menu.Divider/>

                <Menu.Item key="organizations">
                    <Link to={ `/organizations` }>Organizations</Link>
                </Menu.Item>
                <Menu.Divider/>

                {
                    user.organization?.map(
                        org => (
                            <Menu.SubMenu
                                title={ org }
                                key={ org }

                            >
                                <Menu.Divider/>
                                <Menu.Item key={ `${ org }-surveys` }>
                                    <Link to={ `/${ org }/surveys` }>Surveys</Link>
                                </Menu.Item>

                                <Menu.Item key={ `${ org }-translations` }>
                                    <Link to={ `/${ org }/translations` }>Translations</Link>
                                </Menu.Item>

                                <Menu.Item key={ `${ org }-people` }>
                                    <Link to={ `/${ org }/people` }>People</Link>
                                </Menu.Item>
                            </Menu.SubMenu>
                        ),
                    )
                }

                <Menu.Divider/>


            </Menu>

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
