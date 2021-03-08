import React, { useContext } from 'react';

import './Home.less';
import { Menu, List, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { CoreCtx } from '../../index';

type Props = {};

const Home: React.FC<Props> = () => {

    const { user, userToken } = useContext(CoreCtx);

    if (!user || !userToken) {
        return null;
    }

    return <>
        <List
            itemLayout="horizontal"
            dataSource={user.organization?.slice()}
            renderItem={item => (
                <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                        title={<Link to={`/${item}/surveys`}>{item}</Link>}
                        description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                    />
                </List.Item>
            )}
        />
    </>;
};

export default Home;
