import React, { useContext, useRef, useState } from 'react';
import { Button, Col, Dropdown, Input, Layout, Menu, message, Popconfirm, Row, Select, Space } from 'antd';
import { LogoutOutlined, PlusOutlined, UpOutlined } from '@ant-design/icons';
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
    const selectedMenuItem = window.location.pathname.split('/')[1];
    const [user] = useContext(CoreCtx).user;
    const [userToken] = useContext(CoreCtx).userToken;
    const [selectedOrg, setSelectedOrg] = useState<string | null>(user?.organization?.[0] ?? null);

    if (!user || !userToken) {
        return null;
    }

    return (
        <div className="sider">
            <Link to="/" className="logo">
                <Logo/>
            </Link>
            <Menu
                className="sider-menu"
                theme="dark"
                mode="inline"
                defaultSelectedKeys={ [selectedMenuItem] }
                defaultOpenKeys={ [user?.organization?.[0] ?? ''] }
            >

                <Menu.Divider/>

                <Menu.Item key="organizations">
                    <Link to={ `/organizations` }>Organizations</Link>
                </Menu.Item>
                <Menu.Divider/>


                {
                    selectedOrg && (
                        <>
                            <Menu.ItemGroup
                                title={
                                    <Select
                                        defaultValue={ selectedOrg }
                                        onChange={ (org) => setSelectedOrg(org)}
                                        bordered={ false }
                                        style={{
                                            width: '100%'
                                        }}

                                    >
                                        {
                                            user?.organization?.map(
                                                (org: string) => (
                                                    <Select.Option
                                                        key={ `org-select-${ org }` }
                                                        value={ org }>{ org }</Select.Option>
                                                ),
                                            )
                                        }

                                    </Select>
                                }
                            >
                                <Menu.Divider/>
                                <Menu.Item key="surveys">
                                    <Link to={ `/${ selectedOrg }/surveys` }>Surveys</Link>
                                </Menu.Item>

                                <Menu.Item key="translations">
                                    <Link to={ `/${ selectedOrg }/translations` }>Translations</Link>
                                </Menu.Item>

                                <Menu.Item key="people">
                                    <Link to={ `/${ selectedOrg }/people` }>People</Link>
                                </Menu.Item>
                            </Menu.ItemGroup>
                        </>
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
