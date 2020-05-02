import React, { Suspense } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { CoreProvider } from './store';
import { Root } from './root';

const Home = React.lazy(() => import('../screens/home/Home'));
const Surveys = React.lazy(() => import('../screens/Surveys/index'));
const EditSurvey = React.lazy(() => import('../screens/EditSurvey/index'));
const Translations = React.lazy(() => import('../screens/Translations/index'));

const publicPaths = [
  { exact: true, path: '/', component: Home },
  { exact: true, path: '/surveys', component: Surveys },
  { exact: true, path: '/surveys/:survey_id', component: EditSurvey },
  { exact: true, path: '/surveys/:survey_id/:question_index', component: EditSurvey },
  { exact: true, path: '/translations', component: Translations }
];

const publicRoutes = publicPaths.map(({ path, ...props }) => (
  <Route key={path} path={path} {...props} />
));

export const App = () => (
  <BrowserRouter>
    <CoreProvider>
      <Root>
        <Switch>
          <Suspense fallback={<div />}>{publicRoutes}</Suspense>
        </Switch>
      </Root>
    </CoreProvider>
  </BrowserRouter>
);
