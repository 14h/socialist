import React, { PropsWithChildren, useContext, useRef, useState } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';

import AccountCircle from '@material-ui/icons/AccountCircle';
import VerifiedUser from '@material-ui/icons/VerifiedUser';
import ExitToApp from '@material-ui/icons/ExitToApp';

import SpeakerNotes from '@material-ui/icons/SpeakerNotes';
import PeopleAlt from '@material-ui/icons/PeopleAlt';
import Language from '@material-ui/icons/Language';

import { useStyles } from '../styles';
import './styles.css';
import { CoreCtx } from '../../utils/store';
import { Login } from '../Login';

type Props = PropsWithChildren<{}>;

const sections = [
    {
        name: 'Surveys',
        icon: <SpeakerNotes/>,
        id: 'yolo',
    },
    {
        name: 'Translations',
        icon: <Language/>,
        id: 'yolo2',
    },
    {
        name: 'People',
        icon: <PeopleAlt/>,
        id: 'yolo3',
    },
];

export const Root = ({ children }: Props) => {
    const userScopedAdmin = false;

    const classes = useStyles();
    const [open, setOpen] = useState<boolean>(false);
    const [selectedSection, setSelectedSection] = useState<number | null>(null);

    const anchorRef = useRef(null);

    const [user, setUser] = useContext(CoreCtx).user;

    if (user === null) {
        return <Login />;
    }

    const handleOpen = () =>
        setOpen(true);

    const handleClose = () =>
        setOpen(false);

    return (
        <>
            <CssBaseline/>

            <AppBar position='static'>
                <Toolbar className='AppBar'>
                    <Typography
                        variant='h6'
                        className={classes.navbarTitle}
                        onClick={() => setSelectedSection(-1)}
                    >
                        <div>
                            <img
                                src={'https://www.globaldrugsurvey.com/wp-content/themes/globaldrugsurvey/assets/img/logomark.svg'}
                                style={{
                                    filter: 'grayscale(1)',
                                    width: '50px',
                                    margin: '-15px 15px',
                                }}
                                className='stylaLogoNavBar'
                            />
                        </div>
                    </Typography>
                    <Grid container justify='center' wrap='wrap'>
                        {
                            sections.map((
                                section,
                                index,
                            ) =>
                                    <Grid
                                        key={index}
                                        item
                                        xs={2}
                                        style={{ opacity: selectedSection === index ? 1 : 0.5, minWidth: '120px' }}
                                        onClick={() => setSelectedSection(index)}
                                    >
                                        <div>
                                            <Card style={{ backgroundColor: '#000000', color: '#ffffff' }}>
                                                <CardActionArea>
                                                    <CardContent>
                                                        <Typography gutterBottom align="center" variant="h5"
                                                                    component="h2">
                                                            {section.icon}
                                                        </Typography>
                                                        <Typography align="center" variant="body2">
                                                            {section.name}
                                                        </Typography>
                                                    </CardContent>
                                                </CardActionArea>
                                            </Card>
                                        </div>
                                    </Grid>,
                            )
                        }
                    </Grid>
                    <div>
                        <IconButton
                            aria-label='Logged User'
                            aria-controls='menu-appbar'
                            aria-haspopup='true'
                            onClick={handleOpen}
                            ref={anchorRef}
                            className='accountIcon'
                        >
                            <AccountCircle/>
                        </IconButton>
                        <Menu
                            anchorEl={anchorRef.current}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={open}
                            onClose={handleClose}
                        >
                            <div>
                                <MenuItem>

                                    <Typography variant='body1' display='block' gutterBottom>
                                        {user?.email}
                                    </Typography>
                                    &nbsp;
                                    {userScopedAdmin &&
                                    <Typography variant='caption' display='block' gutterBottom>
                                        <Tooltip title="Global Admin">
                                            <VerifiedUser fontSize='small'/>
                                        </Tooltip>
                                    </Typography>
                                    }

                                </MenuItem>
                            </div>

                            <MenuItem onClick={() => setUser(null)}>
                                <Typography variant='overline' display='block' gutterBottom>
                                    <ExitToApp
                                        style={
                                            {
                                                verticalAlign: 'middle',
                                                marginBottom: '2px',
                                            }
                                        }
                                        fontSize='small'
                                    /> LOGOUT
                                </Typography>
                            </MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>

            <Grid container spacing={0} className='gridContainer'>
                <Container
                    className={classes.mainContainer}
                    maxWidth="md"
                >
                    {children}
                </Container>
            </Grid>

        </>
    );
};
