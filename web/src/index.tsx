import React, { useContext, useState } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import './index.less';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { LayoutSider } from '@layout/sider';
import { Layout } from 'antd';
import { Login } from './screens/login/Login';
import { TCoreCtxUseStateEnv } from './types';
import Translations from './screens/Translations';
import { useLocalStorage } from '@utils/helpers';
import { SO7_USER_TOKEN } from './services/userService';
import Home from './screens/home/Home';
import { Organizations } from './screens/Organizations';
import { Surveys } from './screens/Surveys';
import { EditSurvey } from './screens/EditSurvey';

export const CoreCtx = React.createContext<TCoreCtxUseStateEnv>(null as never);

export const CoreProvider = (props: React.PropsWithChildren<{}>) => {
    const userToken = useLocalStorage(SO7_USER_TOKEN, null);
    const user = useState(null);

    const store: any = {
        userToken,
        user,
    };

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
