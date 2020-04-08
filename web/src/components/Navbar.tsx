import React, { PropsWithChildren, useContext, useRef, useState } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
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

import { useStyles } from '../views/styles';
import { CoreCtx } from '../utils/store';
import { Link } from 'react-router-dom';


type Props = PropsWithChildren<{}>;
type Section = {
    name: string;
    icon: any;
    path: string;
}

const sections: Section[] = [
    {
        name: 'Surveys',
        icon: <SpeakerNotes/>,
        path: '/surveys',
    },
    {
        name: 'Translations',
        icon: <Language/>,
        path: '/translations',
    },
    {
        name: 'People',
        icon: <PeopleAlt/>,
        path: '/people',
    },
];

export const NavBar = ({ children }: Props) => {
    const userScopedAdmin = false;

    const classes = useStyles();
    const [open, setOpen] = useState<boolean>(false);

    const anchorRef = useRef(null);

    const [user, setUser] = useContext(CoreCtx).user;

    if (user === null) {
        return null;
    }

    const [currentPathName, setCurrentPathName] = useState<string | null>(window.location.pathname)

    return (
        <AppBar position='static'>
            <Toolbar className='AppBar'>
                <Link to='/' onClick={() => setCurrentPathName(null)}>
                    <Typography
                        variant='h6'
                        className={classes.navbarTitle}
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
                </Link>
                <Grid container justify='center' wrap='wrap'>
                    {
                        sections.map((
                            section,
                            index,
                            ) =>
                                <Link
                                    to={section.path}
                                    onClick={() => setCurrentPathName(section.path)}
                                    style={{
                                        opacity: currentPathName === section.path ? 1 : 0.5,
                                        minWidth: '120px',
                                        textDecoration: 'none'
                                    }}
                                    key={index}
                                >
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
                                </Link>,
                        )
                    }
                </Grid>
                <div>
                    <IconButton
                        aria-label='Logged User'
                        aria-controls='menu-appbar'
                        aria-haspopup='true'
                        onClick={() => setOpen(true)}
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
                        onClose={() => setOpen(false)}
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
    );
};
