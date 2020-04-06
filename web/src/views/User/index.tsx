import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { useStyles } from '../styles';

export const UserView = () => {
    const classes = useStyles();

    return (
        <div>
            <Typography
                variant='h5'
                component='h2'
                className={classes.title}
            >
                Edit User
            </Typography>
            <Paper className={ [classes.paper, classes['paper--withMinHeight']].join(' ') }>
                yyyx
            </Paper>
        </div>
    );
};
