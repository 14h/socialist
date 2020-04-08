import React from 'react';

import Grid from '@material-ui/core/Grid';
import './styles.css';
import { useStyles } from '../styles';
import {
    Avatar,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

type Props = {};

export const CreateSurvey = (props: Props) => {
    const classes = useStyles();


    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={12} md={2}>
                    <List
                        dense={false}
                        subheader={
                            <Typography variant="h6" className={classes.title}>
                                Surveys
                            </Typography>
                        }
                    >
                        <ListItem>
                            <ListItemText
                                primary="Single-line item"
                                secondary={null}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Single-line item"
                                secondary={null}
                            />
                        </ListItem>
                    </List>
                </Grid>
                <Grid item xs={12} md={10}>
                    <List
                        dense={false}
                        subheader={
                            <Typography variant="h6" className={classes.title}>
                                Surveys
                            </Typography>
                        }
                    >
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <FolderIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary="Single-line item"
                                secondary={null}
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="edit">
                                    <EditIcon />
                                </IconButton>
                                <IconButton edge="end" aria-label="delete">
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <FolderIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary="Single-line item"
                                secondary={null}
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="edit">
                                    <EditIcon />
                                </IconButton>
                                <IconButton edge="end" aria-label="delete">
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                </Grid>
            </Grid>

        </>
    );
};
