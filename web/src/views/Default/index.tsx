import React, { useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { useStyles } from '../styles';
import { CoreCtx } from '../../utils/store';

export const DefaultView = () => {
    const classes = useStyles();

    const [user,] = useContext(CoreCtx).user;

    return (
        <div>
            <Typography
                variant='h5'
                component='h2'
                className={classes.title}
            >
                Welcome back, {user?.firstname}
            </Typography>

            <Paper className={classes.paper} elevation={0}>
            </Paper>
        </div>
    );
};
