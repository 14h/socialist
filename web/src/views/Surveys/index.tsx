import React from 'react';

import './styles.css';
import { useStyles } from '../styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {
    Avatar, Button,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
} from '@material-ui/core';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';


type Props = {};
const SURVEYS = [
    {
        id: 1,
        name: 'survey1'
    },
    {
        id: 2,
        name: 'survey2',
    },
    {
        id: 3,
        name: 'survey3',
    }
];

export const Surveys = (props: Props) => {
    const classes = useStyles();


    return (
        <Paper className={classes.paper} elevation={0}>
            <Grid item xs={12} md={12}>
                <div>
                    <List
                        dense={false}
                        subheader={
                            <>
                                <Typography variant="h6" className={classes.title}>
                                    Surveys
                                </Typography>
                                <Link to='/surveys/create'>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="primary"
                                        className={classes.button}
                                        style={
                                            {
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                            }
                                        }
                                    >
                                        Create Survey
                                    </Button>
                                </Link>
                            </>
                        }
                    >
                        {
                            SURVEYS.map( (survey: {
                                id: number;
                                name: string;
                            }) => (
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <FolderIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={survey.name}
                                        secondary={null}
                                    />
                                    <ListItemSecondaryAction>
                                        <Link to={`/surveys/edit/${survey.id}`}>
                                            <IconButton edge="end" aria-label="edit">
                                                <EditIcon />
                                            </IconButton>
                                        </Link>
                                        <IconButton edge="end" aria-label="delete">
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))
                        }
                    </List>
                </div>
            </Grid>
        </Paper>
    );
};
