import React, { Suspense, useContext, useState } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import './index.less';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { LayoutHeader } from '@layout/header';
import { Layout } from 'antd';
import { Login } from './screens/login/Login';
import { TCoreCtxUseStateEnv } from './types';

const Home = React.lazy(() => import('./screens/home/Home'));
const Surveys = React.lazy(() => import('./screens/Surveys/index'));
const EditSurvey = React.lazy(() => import('./screens/EditSurvey/index'));
const Translations = React.lazy(() => import('./screens/Translations/index'));

export const CoreCtx = React.createContext<TCoreCtxUseStateEnv>(null as never);

const useTranslations = () => {
    return useState([]);
};

export const CoreProvider = (props: React.PropsWithChildren<{}>) => {
    const auth = useState({ userToken: 'foo' });
    const user = useState({
        id: '19h',
        username: '19h',
        email: 'kenan@sig.dev',
        firstname: 'Kenan',
        lastname: 'Sulayman',
    });
    const translations = useTranslations();

    const store: any = {
        auth,
        user,
        translations,
    };

    return <CoreCtx.Provider value={store}>{props.children}</CoreCtx.Provider>;
};

export const App = () => {
    const [user] = useContext(CoreCtx).user;

    if (user === null) {
        return <Login/>;
    }

    return (
        <Layout>
            <LayoutHeader/>
            <Switch>
                <Suspense fallback={<div/>}>{publicRoutes}</Suspense>
            </Switch>
        </Layout>
    );
};

const publicPaths = [
    { exact: true, path: '/', component: Home },
    { exact: true, path: '/surveys', component: Surveys },
    { exact: true, path: '/surveys/:survey_id', component: EditSurvey },
    { exact: true, path: '/translations', component: Translations },
];

const publicRoutes = publicPaths.map(({ path, ...props }) => (
    <Route key={path} path={path} {...props} />
));

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
