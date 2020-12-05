import React, { Suspense, useContext, useState } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import './index.less';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { LayoutSider } from '@layout/header';
import { Layout } from 'antd';
import { Login } from './screens/login/Login';
import { TCoreCtxUseStateEnv } from './types';
import { Translation } from './screens/Translations';
import {useLocalStorage} from "@utils/helpers";
import {SO7_USER_TOKEN} from "./services/userService";

const { Sider } = Layout;

const Home = React.lazy(() => import('./screens/home/Home'));
const Surveys = React.lazy(() => import('./screens/Surveys/index'));
const EditSurvey = React.lazy(() => import('./screens/EditSurvey/index'));
const Translations = React.lazy(() => import('./screens/Translations/index'));

export const CoreCtx = React.createContext<TCoreCtxUseStateEnv>(null as never);

export const CoreProvider = (props: React.PropsWithChildren<{}>) => {
    const userToken = useLocalStorage(SO7_USER_TOKEN, null);
    const user = useState(null);

    const initialTranslations = new Map<string, Translation>();
    initialTranslations
    .set(
        "0",
        {
            en: "English translation",
            de: "German translation"
        }
    );

    const translations = useState<Map<string, Translation>>(initialTranslations);

    const store: any = {
        userToken,
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
            <Sider>
                <LayoutSider/>
            </Sider>

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
