import React, { useContext } from 'react';

import './Home.less';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { CoreCtx } from '../../index';

type Props = {};

const Home: React.FC<Props> = () => {
    const selectedOrg = window.location.pathname.split('/')?.[1] ?? null;
    const subSection = window.location.pathname.split('/')?.[2] ?? null;

    const { user, userToken } = useContext(CoreCtx);

    if (!user || !userToken) {
        return null;
    }

    return <>
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
    </>;
};

export default Home;
