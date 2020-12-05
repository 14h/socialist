import React, { Suspense, useContext, useState } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import './index.less';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { LayoutHeader } from '@layout/header';
import { Layout } from 'antd';
import { Login } from './screens/login/Login';
import { TCoreCtxUseStateEnv } from './types';
import { Translation } from './screens/Translations';

const Home = React.lazy(() => import('./screens/home/Home'));
const Surveys = React.lazy(() => import('./screens/Surveys/index'));
const EditSurvey = React.lazy(() => import('./screens/EditSurvey/index'));
const Translations = React.lazy(() => import('./screens/Translations/index'));

export const CoreCtx = React.createContext<TCoreCtxUseStateEnv>(null as never);

export const CoreProvider = (props: React.PropsWithChildren<{}>) => {
    const auth = useState({ userToken: 'foo' });
    const user = useState({
        id: '19h',
        username: '19h',
        email: 'kenan@sig.dev',
        firstname: 'Kenan',
        lastname: 'Sulayman',
    });

    const initialTranslations = new Map<string, Translation>();
    initialTranslations
    .set(
        "0",
        {
            en: "English translation",
            de: "German translation"
        }
    ).set(
        "1",
        {
            en: "English translation 1",
            de: "German translation 1"
        }
    ).set(
        "2",
        {
            en: "English translation 2",
            de: "German translation 2"
        }
    ).set(
        "3",
        {
            en: "English translation 3",
            de: "German translation 3"
        }
    ).set(
        "4",
        {
            en: "English translation 4",
            de: "German translation 4"
        }
    );

    const translations = useState<Map<string, Translation>>(initialTranslations);

    const store: any = {
        auth,
        user,
        translations,
    };

    return <CoreCtx.Provider value={store}>{props.children}</CoreCtx.Provider>;
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
