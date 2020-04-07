import React, { memo, useContext, useState } from 'react';

import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { Redirect } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import { useStyles } from '../styles';
import './styles.css';

import { CoreCtx } from '../../utils/store';

const attemptLogin = async (
    email: string,
    password: string,
) => {
    // throw new Error('Login Error')

    return (
        {
            id: '19h',
            username: '19h',
            email: 'kenan@sig.dev',
            firstname: 'Kenan',
            lastname: 'Sulayman',
        }
    );
};

export const Login = memo(() => {
    const classes = useStyles();

    const [user, setUser] = useContext(CoreCtx).user;
    const { enqueueSnackbar } = useSnackbar();

    if (user !== null) {
        return <Redirect to="/" />;
    }

    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');

    const onClick = async () => {
        if( !email || !password ) {
            return;
        }

        try {
            const user = await attemptLogin(email, password);

            setUser(user);

        } catch (error) {

            enqueueSnackbar(
                JSON.stringify(error?.message),
                {
                    variant: 'error'
                }
            )
        }
    };

    return (
        <div className='loginContainer'>
            <Container maxWidth='sm'>
                <Typography
                    variant='h4'
                    component='h4'
                    className={ classes.title }
                >
                    <img
                        src={"https://www.globaldrugsurvey.com/wp-content/themes/globaldrugsurvey/assets/img/logomark.svg"}
                        style={{
                            filter: 'grayscale(1)',
                            width: '50px',
                            margin: '-15px 15px',
                        }}
                        alt='Coeus'
                    />
                    Coeus
                </Typography>
                <Paper className={classes.paper}>
                    <Grid
                        container
                        direction='column'
                        justify='center'
                        alignItems='center'
                    >
                        <form noValidate>
                            <Box>
                                <TextField
                                required
                                label='E-mail'
                                defaultValue={ email }
                                className={classes.textField}
                                margin='normal'
                                variant='outlined'
                                onChange={(event) => setEmail(event.target.value)}
                            />

                            <TextField
                                required
                                type="password"
                                label='Password'
                                defaultValue={ password }
                                className={classes.textField}
                                margin='normal'
                                variant='outlined'
                                onChange={(event) => setPassword(event.target.value)}
                            />

                            </Box>

                            <Button
                                variant='contained'
                                className={classes.button}
                                onClick={ onClick }
                                color='primary'
                            >
                                Login
                            </Button>
                        </form>
                    </Grid>
                </Paper>
            </Container>
        </div>
    )
});
