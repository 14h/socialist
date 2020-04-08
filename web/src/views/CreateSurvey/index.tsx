import React from 'react';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import './styles.css';
import { useStyles } from '../styles';

type Props = {};

export const CreateSurvey = (props: Props) => {
    const classes = useStyles();


    return (
        <>
            <Grid container spacing={0} className='gridContainer'>
                <Container
                    className={classes.mainContainer}
                    maxWidth="md"
                >
                </Container>
            </Grid>

        </>
    );
};
