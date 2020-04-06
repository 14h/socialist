import React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import { Root } from '../Root';
import { CoreProvider } from '../../utils/store';

import {
    BrowserRouter as Router,
    Switch,
    Redirect,
    Route,
} from "react-router-dom";

import { Login } from '../Login';
import { UserView } from '../User';
import { DefaultView } from '../Default';

export const BaseRouter = () => {
    return <Switch>
        <Route default path="/login">
            <Login />
        </Route>
        <Route path="/survey/:action?/:id?">
            <UserView/>
        </Route>
        <Route path="/">
            <DefaultView />
        </Route>
        <Redirect from="/" to="/login" />
    </Switch>;
}

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
                    <Root>
                        <BaseRouter />
                    </Root>
                </Router>
            </CoreProvider>
        </ThemeProvider>
    );
}
