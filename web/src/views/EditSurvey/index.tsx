import React, { useState } from 'react';

import Grid from '@material-ui/core/Grid';
import './styles.css';
import { useStyles } from '../styles';
import {
    Avatar, Chip,
    IconButton,
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
                    type: 'number',
                    name: 'question2',
                    title: 'question title2',
                    minValue: 0,
                    maxValue: 10,
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
        }
    ],
};

class SurveyListItemComponent extends React.Component<{
    item: SurveyListItem;
    itemSelected: number;
    dragHandleProps: object;
}, {}> {

    render() {
        const {item, itemSelected, dragHandleProps} = this.props;
        const scale = itemSelected * 0.05 + 1;
        const shadow = itemSelected * 15 + 1;
        // const dragged = itemSelected !== 0;

        if (item.type === 'page') {
            return (
                <ListItem>
                    <TextField
                        required
                        defaultValue={ item.title }
                    />
                </ListItem>
            );
        }

        return (
            <ListItem
                style={{
                    transform: `scale(${scale})`,
                    boxShadow: `rgba(0, 0, 0, 0.3) 0px ${shadow}px ${2 * shadow}px 0px`
                }}
            >
                <div className="dragHandle" {...dragHandleProps}>
                    <ListItemAvatar>
                        <Chip
                            avatar={ <Avatar>
                                <MenuIcon />
                            </Avatar> }
                            label={ item.type }
                            clickable={ true }
                        />

                    </ListItemAvatar>
                </div>
                <TextField
                    required
                    defaultValue={ item.title }
                    style={{
                        margin: '0 auto',
                        width: '500px',
                    }}
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
    console.log('surveyId', params.surveyId);

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

    const addPreset = (preset: string) => {
        const surveyListClone = surveyList.slice();
        switch (preset) {
            case 'number':
                surveyListClone.push(
                    {
                        type: 'number',
                        name: 'question21',
                        title: 'question title222',
                        minValue: 0,
                        maxValue: 10,
                    }
                );
                break;
            case 'text':
                surveyListClone.push(
                    {
                        type: 'text',
                        name: 'question1',
                        title: 'lorem Ipsum'
                    }
                );
                break;
            case 'page':
                surveyListClone.push(
                    {
                        type: 'page',
                        name: 'page.name',
                        title: 'Lorum Ipsum Page',
                        conditions: [],
                    }
                );
                break;
            case 'date':
                surveyListClone.push(
                    {
                        type: 'date',
                        name: 'page.name',
                        title: 'Lorem Ipsum Date'
                    }
                );
                break;
            // case 'image':
            //     surveyListClone.push(
            //         {
            //             type: 'image',
            //             name: 'page.name',
            //             title: 'Lorem Ipsum Date'
            //         }
            //     );
            //     break;
            case 'multi':
                surveyListClone.push(
                    {
                        type: 'multi',
                        name: 'page.name',
                        title: 'Lorem Ipsum Multi'
                    }
                );
                break;
        }
        updateSurveyList(
            surveyListClone
        );
    }



    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={12} md={2}>
                    <List
                        dense={false}
                        subheader={
                            <Typography variant="h6" className={classes.title}>
                                Questions
                            </Typography>
                        }
                    >
                        {
                            PRESETS.map( (preset: string, index: number) => (
                                <ListItem key={ `preset-${index}` }>
                                    <Chip
                                        label={ preset }
                                        clickable={ true }
                                        onClick={ () => addPreset(preset) }
                                    />
                                </ListItem>
                            ))
                        }

                    </List>
                </Grid>
                <Grid item xs={12} md={10}>
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

        </>
    );
};
