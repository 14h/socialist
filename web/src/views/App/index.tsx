import React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import { Root } from '../Root';
import { CoreProvider } from '../../utils/store';
import { SnackbarProvider } from 'notistack';

import {
    BrowserRouter as Router,
    Switch,
    Redirect,
    Route,
} from "react-router-dom";

import { Login } from '../Login';
import { UserView } from '../User';
import { DefaultView } from '../Default';
import { Surveys } from '../Surveys';
import { CreateSurvey } from '../CreateSurvey';

export const ConfiguredApp = () => {
    const prefersLightMode = useMediaQuery('(prefers-color-scheme: light)');

    const theme = React.useMemo(
        () =>
            createMuiTheme({
                palette: {
                    type: prefersLightMode ? 'light' : 'dark',
                    primary: {
                        main: prefersLightMode ? '#FFF' : '#000',
                        dark: '#000',
                        light: '#FFF',
                    },
                    text: {
                        secondary: prefersLightMode ? '#AAA' : '#BBB',
                        hint: prefersLightMode ? '#666' : '#EEE',
                    }
                },
            }),
        [prefersLightMode],
    );

    return (
        <ThemeProvider theme={ theme }>
            <CoreProvider>
                <Router>
                    <SnackbarProvider maxSnack={3}>
                        <Root>
                            <Switch>
                                <Route default path="/login">
                                    <Login />
                                </Route>
                                <Route exact path="/survey/:action?/:id?">
                                    <UserView/>
                                </Route>
                                <Route exact path="/">
                                    <DefaultView />
                                </Route>
                                <Route exact path="/surveys">
                                    <Surveys />
                                </Route>
                                <Route exact path="/surveys/create">
                                    <CreateSurvey />
                                </Route>
                                <Route exact path="/surveys/view/:surveyId">
                                    {/*<ViewSurvey />*/}
                                </Route>
                                <Redirect from="/" to="/login" />
                            </Switch>
                        </Root>
                    </SnackbarProvider>
                </Router>
            </CoreProvider>
        </ThemeProvider>
    );
};
