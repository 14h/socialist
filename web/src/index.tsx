import React, { useContext, useState } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import './index.less';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { LayoutHeader } from '@layout/header';
import { Layout, message } from 'antd';
import { Login } from './screens/login/Login';
import { TCoreState } from './types';
import Translations from './screens/Translations';
import Home from './screens/home/Home';
import { Organizations } from './screens/Organizations';
import { Surveys } from './screens/Surveys';
import { EditSurvey } from './screens/EditSurvey';
import { User } from './types/models/User';
import { login_so7, logoutApi, meApi } from './services/userService';

export const CoreCtx = React.createContext<TCoreState>({} as TCoreState);

export const CoreProvider = (props: React.PropsWithChildren<{}>) => {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    const login = async (
        email: string,
        password: string,
    ) => {
        if (!email || !password) {
            return;
        }

        try {
            const fetchedToken = await login_so7(email, password);
            if (!fetchedToken) {
                message.error('failed to get new token');

                return;
            }

            const fetchedUser = await meApi(fetchedToken);
            if (!fetchedUser) {
                message.error('meApi of new token didn\'t work');

                return;
            }

            setUser(fetchedUser);
            setUserToken(fetchedToken);

        } catch (error) {
            message.error(JSON.stringify(error?.message));
        }
    };

    const logout = async () => {
        try {
            if (!userToken) {
                return;
            }
            await logoutApi(userToken);

            setUser(null);
            setUserToken(null);

        } catch (error) {
            setUser(null);

            message.error(JSON.stringify(error?.message));
        }
    };

    const refreshUser = async () => {
        try {
            if (!userToken) {
                return;
            }

            const fetchedUser = await meApi(userToken);
            if (!fetchedUser) {
                message.error('meApi of new token didn\'t work');

                return;
            }

            setUser(fetchedUser);
        } catch (error) {
            message.error(JSON.stringify(error?.message));
        }
    }

    const store: TCoreState = {
        userToken,
        user,
        login,
        logout,
        refreshUser,
    };

    return <CoreCtx.Provider value={ store }>{ props.children }</CoreCtx.Provider>;
};

export const App = () => {
    const { user } = useContext(CoreCtx);

    if (user === null) {
        return <Login/>;
    }

    return (
        <Layout>
            <Layout.Header>
                <LayoutHeader/>
            </Layout.Header>
            <Layout.Content>
                <Switch>
                    <Route exact={ true } path={ '/' } component={ Home }/>
                    <Route exact={ true } path={ '/organizations' } component={ Organizations }/>
                    <Route exact={ true } path={ '/:orgName/surveys' } component={ Surveys }/>
                    <Route exact={ true } path={ '/:orgName/people' } component={ Surveys }/>
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
