import React from 'react';
import { Root } from '../Root';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme, useMediaQuery } from '@material-ui/core';

type TAppsProps = Readonly<{
    loginViewPath: string;
    routes: JSX.Element[];
}>;

export const App = ( { routes }: TAppsProps ) => {

};
