import React, { useState } from 'react';

import Grid from '@material-ui/core/Grid';
import './styles.css';
import { useStyles } from '../styles';
import {
    Avatar, Chip,
    IconButton, InputLabel,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText, TextField,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import MenuIcon from '@material-ui/icons/Menu';
import { Condition, Question, Survey } from '../../types';
import { useParams } from 'react-router-dom';
import DraggableList from 'react-draggable-list';
import { useLocalStorage } from '../../utils/hooks';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select'
import Paper from '@material-ui/core/Paper';

const PRESETS = [ 'number', 'text', 'page', 'date', 'image', 'multi'];

type Props = {};


type SurveyListItem = SurveyListItemPage | Question;
type SurveyListItemPage = {
    type: 'page';
    name: string;
    title: string;
    conditions?: Condition[];
};


const SURVEY: Survey = {
    name: 'survey1',
    title: 'survey name',
    pages: [
        {
            name: 'page1',
            title: 'page1',
            conditions: [],
            questions: [
                {
                    type: 'number',
                    name: 'question1',
                    title: 'question title',
                    minValue: 0,
                    maxValue: 10,
                },
                {
                    type: 'text',
                    name: 'question2',
                    title: 'question title2',
                    minCharacters: 0,
                    maxCharacters: 10,
                }
            ],
        },
        {
            name: 'page2',
            title: 'page2',
            conditions: [],
            questions: [
                {
                    type: 'number',
                    name: 'question21',
                    title: 'question title222',
                    minValue: 0,
                    maxValue: 10,
                },
                {
                    type: 'number',
                    name: 'question22',
                    title: 'question title22',
                    minValue: 0,
                    maxValue: 10,
                }
            ],
        },
        {
            name: 'page3',
            title: 'page3',
            conditions: [],
            questions: [
                {
                    type: 'number',
                    name: 'question31',
                    title: 'question title222',
                    minValue: 0,
                    maxValue: 10,
                },
                {
                    type: 'number',
                    name: 'question32',
                    title: 'question title22',
                    minValue: 0,
                    maxValue: 10,
                }
            ],
        },
    ],
};

const renderQuestionForm = (item: SurveyListItem) => {
    switch (item.type) {
        case 'text':
            return (
                <FormControl>
                    <div
                        style={{
                            borderTop: '1px #777 solid',
                            minHeight: '30px',
                            marginTop: '10px'
                        }}
                    />
                    <Grid
                        container
                        direction="row"
                        justify="space-around"
                    >
                        <TextField
                            label="Min Characters"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                                style: {color: '#BBB'}
                            }}
                        />
                        <TextField
                            label="Max Characters"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                                style: {color: '#BBB'}
                            }}
                        />
                    </Grid>
                </FormControl>
            );
        case 'number':
            return (
                <FormControl>
                    <div
                        style={{
                            borderTop: '1px #777 solid',
                            minHeight: '30px',
                            marginTop: '10px'
                        }}
                    />
                    <Grid
                        container
                        direction="row"
                        justify="space-around"
                    >
                        <TextField
                            label="Min Value"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                                style: {color: '#BBB'}
                            }}
                        />
                        <TextField
                            label="Max Value"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                                style: {color: '#BBB'}
                            }}
                        />
                    </Grid>
                </FormControl>
            );
        default:
            return (
                <div/>
            )
    }
}

class SurveyListItemComponent extends React.Component<{
    item: SurveyListItem;
    itemSelected: number;
    dragHandleProps: object;
}, {}> {

    render() {
        const {item, itemSelected, dragHandleProps, anySelected} = this.props;
        console.log(this.props)
        const scale = itemSelected * 0.05 + 1;
        const shadow = itemSelected * 15 + 1;
        // const dragged = itemSelected !== 0;

        return (
            <ListItem
                style={{
                    transform: `scale(${scale})`,
                    boxShadow: `rgba(0, 0, 0, 0.3) 0px ${shadow}px ${2 * shadow}px 0px`,
                    border: '1px #555 solid',
                    borderRadius: '4px',
                }}
            >
                <Grid
                    container
                    direction="column"
                >
                    <Grid
                        container
                        justify="space-between"
                    >
                        <div className="dragHandle" {...dragHandleProps}>
                            <ListItemAvatar>
                                <Avatar>
                                    <MenuIcon />
                                </Avatar>

                            </ListItemAvatar>
                        </div>
                        <TextField
                            required
                            defaultValue={ item.title }
                            style={{
                                margin: '0 auto',
                                width: '450px',
                            }}
                        />
                        <FormControl>
                            <Select
                                value={item.type}
                                onChange={console.log}
                                style={{
                                    width: '100px',
                                }}
                            >
                                {
                                    PRESETS.map((preset: string, index: number) =>(
                                        <MenuItem
                                            value={preset}
                                            key={`preset-${index}`}
                                        >
                                            {preset}
                                        </MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        <IconButton edge="end" aria-label="delete">
                            <DeleteIcon />
                        </IconButton>
                    </Grid>

                    { renderQuestionForm(item) }
                </Grid>

            </ListItem>
        );
    }
}


const mapSurveyToSurveyList = (survey: Survey): SurveyListItem[] => {
    const surveyListBase: SurveyListItem[] = [];

    for (const page of survey.pages) {
        surveyListBase.push({
            type: 'page',
            name: page.name,
            title: page.title,
            conditions: page.conditions,
        });
        surveyListBase.push(...page.questions);
    }
    return surveyListBase;
};


export const EditSurvey = (props: Props) => {
    const classes = useStyles();
    const params = useParams<{surveyId: string}>();

    // const [surveyList, setSurveyList] = useLocalStorage('gds-surveyList', mapSurveyToSurveyList(SURVEY));
    const [surveyList, setSurveyList] = useState(mapSurveyToSurveyList(SURVEY));
    const updateSurveyList = (list: SurveyListItem[]) => {
        setSurveyList(list.map( (item: SurveyListItem, index: number) => Object.assign(
            {},
            item,
            {
                name: `item-${index}`,
            }
        )));
    }


    // const [survey, setSurvey] = useLocalStorage('gds-survey', SURVEY);

    // const updatePageInSurvey = (
    //     pageIndex: number,
    //     name: string,
    //     conditions: any,
    //     questions: Question[],
    // ) => {
    //     const newSurvey = survey.slice();
    //     newSurvey[pageIndex] = {
    //         name,
    //         conditions,
    //         questions
    //     }
    //     setSurvey(newSurvey)
    // }

    const handleMoveEnd = (newList: SurveyListItem[], movedItem: SurveyListItem, oldIndex: number, newIndex: number) => {
        setSurveyList(newList);
        return;
    }


    return (
        <Paper className={classes.paper}>
            <Grid container spacing={1}>
                <Grid item xs={12} md={12}>
                    <List
                        dense={false}
                        subheader={
                            <Typography variant="h6" className={classes.title}>
                                Survey Title
                            </Typography>
                        }
                    >
                        <DraggableList<SurveyListItem, void, SurveyListItemComponent>
                            itemKey="name"
                            template={SurveyListItemComponent}
                            list={surveyList}
                            onMoveEnd={handleMoveEnd}
                            container={() => document.body}
                        />
                    </List>
                </Grid>
            </Grid>
        </Paper>
    );
};
