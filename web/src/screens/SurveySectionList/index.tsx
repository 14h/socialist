import React from 'react';

import './styles.less';
import { Link } from 'react-router-dom';
import { SurveyStore } from '@utils/hooks';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { AddSection } from '../EditSurvey/Components/AddSection';
import { createTranslation } from '../../services/translationService';
import { Popconfirm } from 'antd';
import { TranslationEditor } from '../EditSurvey/Components/TranslationEditor';
import { ItemSettings } from '../EditSurvey/Components/ItemSettings';

type TProps = {
    surveyStore: SurveyStore;
    userToken: string;
    orgName: string;
}

export const SurveySectionList = (props: TProps) => {
    const {
        surveyStore,
        orgName,
        userToken,
    } = props;

    const survey = surveyStore.value;

    const addSection = async (name: string, index: number) => {
        const translation = await createTranslation(userToken);
        await surveyStore.insertSection(
            {
                name,
                description: translation.id,
                items: [],
                conditions: [],
            },
            index,
        );
    };


    return (
        <div className='section-tab'>
            <AddSection
                callback={(name) => addSection(name, 0)}
            />
            {survey.sections.map((section, index) => (
                <div>
                    <div className="survey-section">
                        <div>
                            Section: {section.name}
                        </div>
                        <div>
                            Questions: {section.items.length}
                            &nbsp;
                            <Link to={ `/${ orgName }/surveys/${survey.id}/section/${ index }` }>
                                <EditOutlined style={ { fontSize: '16px'} }/>
                            </Link>
                        </div>
                        <div>
                            Conditions: {section.conditions?.length ?? 0}
                        </div>
                        <hr/>
                        <TranslationEditor
                            id={ section.description }
                            userToken={ userToken }
                            editMode={ true }
                        />
                        <div className='item-actions'>
                            <Popconfirm
                                title="Are you sure?"
                                onConfirm={ () => surveyStore.deleteSection(index) }
                                okText="Delete"
                                cancelText="Cancel"
                            >
                                <DeleteOutlined style={ { fontSize: '24px', color: '#a61d24' } }/>
                            </Popconfirm>
                        </div>
                    </div>
                    <AddSection
                        callback={(name) => addSection(name, index + 1)}
                    />
                </div>
            ))}
        </div>
    );
}
