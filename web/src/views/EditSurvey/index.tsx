import React from 'react';

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
    ListItemText,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import MenuIcon from '@material-ui/icons/Menu';
import { Condition, Page, Question, Survey } from '../../types';
import { useParams } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import DraggableList from 'react-draggable-list';
import { useLocalStorage } from '../../utils/hooks';

const PRESETS = [
    {
        type: 'base',
        name: 'number',
    },
    {
        type: 'base',
        name: 'text',
    },
];


type Props = {};


type SurveyListItem = SurveyListItemHeader | SurveyListItemBase | Question;
type SurveyListItemHeader = {
    type: 'header';
    name: string;
    conditions?: Condition[];
};
type SurveyListItemBase = {
    type: 'base';
    name: string;
}


const SURVEY: Survey = [
    {
        name: 'page1',
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
];

class SurveyListItemComponent extends React.Component<{
    item: SurveyListItem;
    itemSelected: number;
    dragHandleProps: object;
}, {}> {

    render() {
        const {item, itemSelected, dragHandleProps} = this.props;
        const scale = itemSelected * 0.05 + 1;
        const shadow = itemSelected * 15 + 1;
        const dragged = itemSelected !== 0;

        if (item.type === 'base') {
            return (
                <ListItem>
                    <div className="dragHandle" {...dragHandleProps}>
                        <Chip
                            label={ item.name }
                        />
                    </div>
                </ListItem>
            );
        }

        if (item.type === 'header') {
            return (
                <ListItem>
                    <Typography align="center" variant="body2">
                        {item.name}
                    </Typography>
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
                        <Avatar>
                            <MenuIcon />
                        </Avatar>
                    </ListItemAvatar>
                </div>
                <ListItemText
                    primary={item.title}
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
        );
    }
}


const mapSurveyToSurveyList = (survey: Survey): SurveyListItem[] => {
    const surveyListBase: SurveyListItem[] = [];

    surveyListBase.push(
        ...PRESETS
    );

    for (const page of survey) {
        surveyListBase.push({
            type: 'header',
            name: page.name,
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

    const [surveyList, setSurveyList] = useLocalStorage('gds-surveyList', mapSurveyToSurveyList(SURVEY));


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
        if (newIndex < PRESETS.length) {
            // something got moved in the presets
            return;
        }
        setSurveyList(newList);
        return;

        // const newSurveyList = [];
        //
        // if (oldIndex < PRESETS.length && newIndex > PRESETS.length) {
        //     // a preset got moved in
        //     newSurveyList.push(
        //         ...PRESETS
        //     );
        //
        //     const list = newList
        //         .slice(PRESETS.length - 1)
        //         .map(
        //             (item: SurveyListItem, index: number) => {
        //                 if (item.type === 'base') {
        //                     return (
        //                         {
        //                             type: item.name,
        //                             name: `${item.name}-${index * Math.floor(Math.random() * 100)}`,
        //                             title: `${item.name}-${index}`,
        //                         }
        //                     )
        //                 }
        //
        //                 return item;
        //             }
        //         );
        //
        //     newSurveyList.push(
        //         ...list,
        //     )
        //
        //
        // }
        //
        // setSurveyList(newSurveyList)
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
                    {/*{survey.map((page: Page, pageIndex: number) => (*/}
                    {/*    <Paper className={classes.paper} elevation={0} key={`page-${pageIndex}`}>*/}
                    {/*        <List*/}
                    {/*            dense={false}*/}
                    {/*            subheader={*/}
                    {/*                <Typography variant="h6" className={classes.title}>*/}
                    {/*                    {page.name}*/}
                    {/*                </Typography>*/}
                    {/*            }*/}
                    {/*        >*/}
                    {/*            <DraggableList<Question, void, QuestionItem>*/}
                    {/*                itemKey="name"*/}
                    {/*                template={QuestionItem}*/}
                    {/*                list={page.questions}*/}
                    {/*                onMoveEnd={(questions: Question[]) => updatePageInSurvey(pageIndex, page.name, page.conditions, questions)}*/}
                    {/*                container={() => document.body}*/}
                    {/*            />*/}
                    {/*        </List>*/}
                    {/*    </Paper>*/}
                    {/*))}*/}
                    </List>
                </Grid>
            </Grid>

        </>
    );
};
