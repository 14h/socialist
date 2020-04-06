import React, { memo, useContext, useState } from 'react';

import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import { Redirect } from 'react-router-dom';

import { useStyles } from '../styles';
import './styles.css';

import { CoreCtx } from '../../utils/store';

export const Login = memo(() => {
    const classes = useStyles();

    const [user,] = useContext(CoreCtx).user;

    if (user !== null) {
        return <Redirect to="/" />;
    }

    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');

    const onClick = async () => {
        if( !email || !password ) {
            return;
        }
    };

    return (
        <div className='loginContainer'>
            { false &&
                <div>
                    <Snackbar
                        anchorOrigin={ { vertical: 'bottom', horizontal: 'left' } }
                        open={ true }
                        message={<span id="message-id">Login Error</span>}
                    />
                </div>
            }

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
                                type="submit"
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
