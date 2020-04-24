import React, { PropsWithChildren, useContext } from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import { useStyles } from '../styles';
import './styles.css';
import { CoreCtx } from '../../utils/store';
import { Login } from '../Login';
import { NavBar } from '../../components/Navbar';

type Props = PropsWithChildren<{}>;

export const Root = ({ children }: Props) => {
    const classes = useStyles();

    const [user,] = useContext(CoreCtx).user;
    console.log(user)

    if (user === null) {
        return <Login />;
    }

    return (
        <>
            <CssBaseline/>
            <NavBar />

            <Grid container spacing={0} className='gridContainer'>
                <Container
                    className={classes.mainContainer}
                    maxWidth="xl"
                >
                    {children}
                </Container>
            </Grid>

        </>
    );
};
