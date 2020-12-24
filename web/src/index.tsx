import React, { useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import './index.less';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { LayoutSider } from '@layout/sider';
import { Layout, Spin } from 'antd';
import { Login } from './screens/login/Login';
import { TCoreCtxUseStateEnv } from './types';
import Translations from './screens/Translations';
import { useLocalStorage } from '@utils/helpers';
import { meApi, SO7_USER_TOKEN } from './services/userService';
import Home from './screens/home/Home';
import { Organizations } from './screens/Organizations';
import { Surveys } from './screens/Surveys';
import { EditSurvey } from './screens/EditSurvey';
import { User } from './types/models/User';

export const CoreCtx = React.createContext<TCoreCtxUseStateEnv>(null as never);

export const CoreProvider = (props: React.PropsWithChildren<{}>) => {
    const [userToken, setUserToken] = useLocalStorage<string | null>(SO7_USER_TOKEN, null);
    const [user, setUser] = useState<User | null>(null);

    const store: any = {
        userToken: [userToken, setUserToken],
        user: [user, setUser],
    };

    useEffect(() => {
        // try using saved auth on first render
        if (!userToken) {
            return;
        }

        try {
            (async () => {
                const user = await meApi(userToken);

                if (!user) {
                    throw new Error('me endpoint didn\'t work ');
                }

                setUser(user);
            })();
        } catch (error) {
            console.log(error);
            setUserToken(null);
        }
    }, []);

    return <CoreCtx.Provider value={ store }>{ props.children }</CoreCtx.Provider>;
};

export const App = () => {
    const [user] = useContext(CoreCtx).user;

    if (user === null) {
        return <Login/>;
    }

    return (
        <Layout>
            <Layout.Sider>
                <LayoutSider/>
            </Layout.Sider>
            <Layout.Content>
                <Switch>
                    <Route exact={ true } path={ '/' } component={ Home }/>
                    <Route exact={ true } path={ '/organizations' } component={ Organizations }/>
                    <Route exact={ true } path={ '/:orgName/surveys' } component={ Surveys }/>
                    <Route exact={ true } path={ '/:orgName/surveys/:survey_id' } component={ EditSurvey }/>
                    <Route exact={ true } path={ '/:orgName/translations' } component={ Translations }/>
                </Switch>
            </Layout.Content>
        </Layout>
    );
};

ReactDOM.render(
    <BrowserRouter>
        <CoreProvider>
            <App/>
        </CoreProvider>
    </BrowserRouter>,
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
