import React, { useContext, useState } from 'react';
import { Button, Layout, Tabs } from 'antd';
import { Item, Section } from '../../types';
import { useParams } from 'react-router';
import 'react-quill/dist/quill.snow.css';
import { SurveyActions } from './Components/SurveyActions';
import { useSurvey } from '@utils/hooks';
import { SectionItem } from './Components/SectionItem';

import './styles.css';
import { AddItem } from './Components/AddItem';
import { Translation } from '../Translations';
import { CoreCtx } from '../../index';

const AddNewSectionButton = () => {
    const { survey_id } = useParams();
    const [userToken] = useContext(CoreCtx).userToken;
    const [user] = useContext(CoreCtx).user;
    // const [translations, setTranslations] = useContext(CoreCtx).translations;
    const translations = new Map<string, Translation>();
    const setTranslations = console.log;
    const currentLang = 'en';
    const surveyStore = useSurvey(
        userToken,
        survey_id,
        user
    );

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

        const newSection = {
            name: `newPage_${ surveyStore.value.sections.length }`,
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


export const EditSurvey = () => {
    const { survey_id } = useParams();
    const [userToken] = useContext(CoreCtx).userToken;
    const [user] = useContext(CoreCtx).user;
    // const [translations, setTranslations] = useContext(CoreCtx).translations;
    const surveyStore = useSurvey(
        userToken,
        survey_id,
        user
    );

    const survey = surveyStore.value;
    const currentLang = 'en';

    const sections = surveyStore.value?.sections ?? [];

    const [sectionKey, setSectionKey] = useState(sections?.[0]?.name);

    // const [translations, setTranslations] = useContext(CoreCtx).translations;
    const translations = new Map<string, Translation>();
    const setTranslations = console.log;

    const [selectedItemIndex, setSelectedItemIndex] = useState(0);


    const removePage = (key: any) => {
        const sectionIndex = sections.findIndex((s: Section) => s.name === key);
        if (sectionIndex < 0) {
            console.warn('Page not found');
            return;
        }

        surveyStore.deleteSection(sectionIndex);
    };

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
        <div className="survey-wrapper">
            <div className="survey-title">
                { survey.meta.name }
                <SurveyActions/>
            </div>
            <Layout>
                <Tabs
                    type="editable-card"
                    onChange={ setSectionKey }
                    activeKey={ sectionKey }
                    onEdit={ removePage }
                    hideAdd={ true }
                    tabBarExtraContent={ <AddNewSectionButton/> }
                    size="large"
                >
                    { sections.map((section: Section, sectionIndex: number) => (
                        <Tabs.TabPane tab={ section.name } key={ section.name } closable={ true }>
                            <div className='section-tab'>
                                <AddItem
                                    callback={
                                        (type: Item['type']) => {
                                            insertNewItem(type, sectionIndex, 0);
                                            setSelectedItemIndex(0);
                                        }
                                    }
                                />
                                { section.items.map((item: Item, itemIndex: number) => (
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
        </div>
    );
};
