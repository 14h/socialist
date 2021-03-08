import React, { useContext, useState } from 'react';
import { Button, Layout, Tabs } from 'antd';
import { Item, Section } from '../../types';
import { useParams, useRouteMatch } from 'react-router';
import 'react-quill/dist/quill.snow.css';
import { SurveyActions } from './Components/SurveyActions';
import { SurveyStore, useSurvey } from '@utils/hooks';
import { SectionItem } from './Components/SectionItem';

import './styles.less';
import { AddItem } from './Components/AddItem';
import { Translation } from '../Translations';
import { CoreCtx } from '../../index';
import { Route, Switch } from 'react-router-dom';

const AddNewSectionButton = ({ surveyStore }: { surveyStore: SurveyStore }) => {
    const translations = new Map<string, Translation>();
    const setTranslations = console.log;
    const currentLang = 'en';

    const handleOnClick = () => {
        const newTranslationKey = translations.size.toString();
        const newTranslation = {
            [currentLang]: '',
        };

        const cloneMap = new Map(translations);
        cloneMap.set(
            newTranslationKey,
            newTranslation,
        );

        setTranslations(
            cloneMap,
        );

        const newSection: Section = {
            name: 'Untitled section',
            description: newTranslationKey,
            items: [],
            conditions: [],
        };

        surveyStore.insertSection(newSection);
    };

    return (
        <Button
            onClick={ handleOnClick }
            style={ { marginRight: '8px' } }
        >
            Add new page
        </Button>
    );
};

const Sections = ({ surveyStore }: { surveyStore: SurveyStore }) => {
    const currentLang = 'en';

    const sections = surveyStore.value?.sections ?? [];

    const translations = new Map<string, Translation>();
    const setTranslations = console.log;


    const [selectedItemIndex, setSelectedItemIndex] = useState(0);

    const insertNewItem = (type: Item['type'], sectionIndex: number, itemIndex: number) => {
        const newTranslationKey = translations.size.toString();
        const newTranslation = {
            [currentLang]: '',
        };

        const cloneMap = new Map(translations);
        cloneMap.set(
            newTranslationKey,
            newTranslation,
        );

        setTranslations(
            cloneMap,
        );

        const newItem: Item = {
            type,
            description: newTranslationKey,
            name: newTranslationKey,
        };
        surveyStore.insertItem(newItem, sectionIndex, itemIndex);
    };

    return (
        <Layout>
            <Tabs
                type="editable-card"
                onEdit={ surveyStore.deleteSection as any }
                hideAdd={ true }
                tabBarExtraContent={ <AddNewSectionButton surveyStore={ surveyStore }/> }
                size="large"
            >
                { sections.map((section: Section, sectionIndex: number) => (
                    <Tabs.TabPane tab={ section.name } key={ sectionIndex } closable={ true }>
                        <div className='section-tab'>
                            <AddItem
                                callback={
                                    (type: Item['type']) => {
                                        insertNewItem(type, sectionIndex, 0);
                                        setSelectedItemIndex(0);
                                    }
                                }
                            />
                            { (section?.items ?? []).map((item: Item, itemIndex: number) => (
                                <>
                                    <div
                                        onClick={ () => setSelectedItemIndex(itemIndex) }
                                        style={ {
                                            position: 'relative',
                                        } }
                                    >
                                        <SectionItem
                                            key={ `EditSurveyListItem-${ itemIndex }` }
                                            item={ item }
                                            surveyStore={ surveyStore }
                                            editMode={ selectedItemIndex === itemIndex }
                                            sectionIndex={ sectionIndex }
                                            itemIndex={ itemIndex }
                                        />
                                    </div>

                                    <AddItem
                                        callback={
                                            (type: Item['type']) => {
                                                insertNewItem(type, sectionIndex, itemIndex + 1);
                                                setSelectedItemIndex(itemIndex + 1);
                                            }
                                        }
                                    />
                                </>
                            )) }
                        </div>
                    </Tabs.TabPane>
                )) }
            </Tabs>
        </Layout>
    );
};


export const EditSurvey = () => {
    const { path } = useRouteMatch();
    const { survey_id } = useParams();
    const { user, userToken } = useContext(CoreCtx);

    const surveyStore = useSurvey(
        userToken,
        survey_id,
        user,
    );

    const survey = surveyStore.value;

    return (
        <div className="survey-wrapper">
            <div className="survey-title">
                { survey.meta.name }
                <SurveyActions/>
            </div>
            <Switch>
                <Route exact={ true } path={ path } render={ () => (
                    <Sections surveyStore={ surveyStore }/>
                ) }/>
                <Route exact={ true } path={ `${ path }/settings` } render={ () => (
                    <Sections surveyStore={ surveyStore }/>
                ) }/>
                <Route exact={ true } path={ `${ path }/section/:section_id` } render={ () => (
                    <Sections surveyStore={ surveyStore }/>
                ) }/>
            </Switch>

        </div>
    );
};
