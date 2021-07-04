import React, { useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import './index.less';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { LayoutHeader } from '@layout/header';
import { Layout, message } from 'antd';
import { Login } from './screens/login/Login';
import { TCoreState } from './types';
import Translations from './screens/Translations';
import { Organizations } from './screens/Organizations';
import { Surveys } from './screens/Surveys';
import { User } from './types/models/User';
import { login_so7, logoutApi, meApi } from './services/userService';
import { useLocalStorage } from '@utils/helpers';
import { EditSurvey } from './screens/EditSurvey';

export const CoreCtx = React.createContext<TCoreState>({} as TCoreState);

export const CoreProvider = (props: React.PropsWithChildren<{}>) => {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [email, setEmail] = useLocalStorage<string | null>('SO7_EMAIL', null);
    const [password, setPassword] = useLocalStorage<string | null>('SO7_EMAIL', null);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (!email || !password) {
            setPassword(null);
            setEmail(null);

            return;
        }

        login('root@gds.fauna.dev', password);
    }, []);

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
                return;
            }

            const fetchedUser = await meApi(fetchedToken);
            if (!fetchedUser) {
                return;
            }

            setUser(fetchedUser);
            setEmail(email);
            setPassword(password);
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

            setEmail(null);
            setPassword(null);
        } catch (error) {
            setUser(null);
            setEmail(null);
            setPassword(null);

            message.error(JSON.stringify(error?.message));
        }
    };

    const store: TCoreState = {
        userToken,
        user,
        login,
        logout,
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
                <div className="table">
                    <Switch>
                        <Route exact={ true } path={ '/' } component={ Organizations }/>
                        <Route exact={ true } path={ '/organizations' } component={ Organizations }/>
                        <Route exact={ true } path={ '/:orgId/surveys' } component={ Surveys }/>
                        <Route exact={ false } path={ '/:orgName/surveys/:survey_id' } component={ EditSurvey }/>
                        <Route exact={ true } path={ '/:orgName/translations' } component={ Translations }/>
                    </Switch>
                </div>
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
