import React, { useContext, useState } from 'react';
import { Button, Layout, Tabs } from 'antd';
import { Item, Section} from '../../types';
import { useParams } from 'react-router';
import 'react-quill/dist/quill.snow.css';
import { SurveyActions } from './Components/SurveyActions';
import { ItemFormat } from './Components/ItemFormat';
import { useSurvey } from '@utils/hooks';
import { SectionItem } from './Components/SectionItem';

import './styles.css';
import { CoreCtx } from '../../index';
import { ItemEdit } from './Components/ItemEdit';


const AddNewSectionButton = () => {
    const { survey_id } = useParams();
    const [translations, setTranslations] = useContext(CoreCtx).translations;
    const currentLang = 'en';
    const surveyStore = useSurvey(survey_id);

    const handleOnClick = () => {
        const newTranslationKey = translations.size.toString();
        const newTranslation = {
            [currentLang]: ''
        }

        const cloneMap = new Map(translations)
        cloneMap.set(
            newTranslationKey,
            newTranslation,
        );

        setTranslations(
            cloneMap
        );

        const newSection = {
            name: `newPage_${surveyStore.value.sections.length}`,
            description: newTranslationKey,
            items: [],
            conditions: []
        };

        surveyStore.insertSection(newSection)
    }

    return (
        <Button
            onClick={handleOnClick}
            style={{marginRight: '8px'}}
        >
            Add new page
        </Button>
    );
}


const EditSurvey = () => {
    const { survey_id } = useParams();
    const surveyStore = useSurvey(survey_id);
    const currentLang = 'en';

    const sections = surveyStore.value?.sections ?? [];

    const [sectionKey, setSectionKey] = useState(sections?.[0]?.name);

    const [translations, setTranslations] = useContext(CoreCtx).translations;

    const [selectedItemIndex, setSelectedItemIndex] = useState(0);

    const removePage = (key: any) => {
        const sectionIndex = sections.findIndex((s: Section) => s.name === key);
        if (sectionIndex < 0) {
            console.warn('Page not found');
            return;
        }

        surveyStore.deleteSection(sectionIndex);
    }

    const insertNewItem = (type: Item['type'], sectionIndex: number, itemIndex: number) => {
        const newTranslationKey = translations.size.toString();
        const newTranslation = {
            [currentLang]: ''
        }

        const cloneMap = new Map(translations)
        cloneMap.set(
            newTranslationKey,
            newTranslation,
        );

        setTranslations(
            cloneMap
        );

        const newItem: Item = {
            type,
            description: newTranslationKey,
            name: newTranslationKey,
        };
        surveyStore.insertItem(newItem, sectionIndex, itemIndex)
    };

    return (
        <div className="survey-wrapper">
            <div className="survey-title">
                {survey_id}
                <SurveyActions />
            </div>
            <Layout>
                <Tabs
                    type="editable-card"
                    onChange={setSectionKey}
                    activeKey={sectionKey}
                    onEdit={removePage}
                    hideAdd={true}
                    tabBarExtraContent={ <AddNewSectionButton /> }
                    size="large"
                >
                    {sections.map((section: Section, sectionIndex: number) => (
                        <Tabs.TabPane tab={section.name} key={section.name} closable={true} >
                            <div
                                className='section-tab'
                            >
                                <div
                                    style={{
                                        width: '70%',
                                        padding: '16px',
                                    }}
                                >
                                    <ItemFormat
                                        callback={(type: Item['type']) => insertNewItem(type, sectionIndex, 0)}
                                        className="add-new-item"
                                    >
                                        <Button>Add item</Button>
                                    </ItemFormat>
                                    {section.items.map((item: Item, itemIndex: number) => (
                                        <>
                                            <div
                                                onClick={() => setSelectedItemIndex(itemIndex)}
                                            >
                                                <SectionItem
                                                    key={`EditSurveyListItem-${itemIndex}`}
                                                    item={item}

                                                />
                                            </div>

                                            <ItemFormat
                                                callback={(type: Item['type']) => insertNewItem(type, sectionIndex, itemIndex)}
                                                className="add-new-item"
                                            >
                                                <Button>Add item</Button>
                                            </ItemFormat>
                                        </>
                                    ))}
                                </div>
                                <ItemEdit
                                    section={section}
                                    itemIndex={selectedItemIndex}
                                    sectionIndex={sectionIndex}
                                    surveyStore={surveyStore}
                                />
                            </div>

                        </Tabs.TabPane>
                    ))}
                </Tabs>
            </Layout>
        </div>
    );
};

export default EditSurvey;
