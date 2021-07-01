import React, { useContext, useState } from 'react';
import { Breadcrumb, Button, Layout, Tabs, Typography } from 'antd';
import { Item, Section, TranslationRef } from '../../types';
import { useParams, useRouteMatch } from 'react-router';
import 'react-quill/dist/quill.snow.css';
import { SurveyActions } from './Components/SurveyActions';
import { SurveyStore, useSurvey } from '@utils/hooks';
import { SectionItem } from './Components/SectionItem';

import './styles.less';
import { CoreCtx } from '../../index';
import { Route, Switch } from 'react-router-dom';
import { SurveySectionList } from '../SurveySectionList';
import { HomeOutlined, PlusOutlined } from '@ant-design/icons';
import { AddItem } from './Components/AddItem';
import { createTranslation } from '../../services/translationService';

const { Title } = Typography;

const Sections = ({ surveyStore, userToken }: { surveyStore: SurveyStore; userToken: string }) => {
    const { section_index } = useParams();
    const [selectedItemIndex, setSelectedItemIndex] = useState(0);

    if (!section_index) {
        return null;
    }

    const section = surveyStore.value?.sections?.[Number(section_index)];

    const addItem = async (type: Item["type"], index: number) => {
        const translation = await createTranslation(userToken)

        const newItem: Item = {
            type,
            name: 'newItem',
            description: translation.id,
        }

        surveyStore.insertItem(
            newItem,
            Number(section_index),
            index,
        );

    };


    return (
        <div className='section-tab'>
            <AddItem
                callback={(type) => addItem(type, 0)}
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
                            userToken={ userToken }
                            item={ item }
                            surveyStore={ surveyStore }
                            editMode={ selectedItemIndex === itemIndex }
                            sectionIndex={ Number(section_index) }
                            itemIndex={ itemIndex }
                        />
                    </div>

                    <AddItem
                        callback={(type) => addItem(type, itemIndex + 1)}
                    />
                </>
            )) }
        </div>
    );
};

const PageBreadcrumbs = ({orgName, surveyName}: {orgName: string, surveyName: string}) => (
    <Breadcrumb>
        <Breadcrumb.Item href="">
            <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="">
            <span>{ orgName }</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
            <span>Surveys</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item href="">
            <span>{ surveyName }</span>
        </Breadcrumb.Item>
    </Breadcrumb>
);


export const EditSurvey = () => {
    const { path } = useRouteMatch();
    const { survey_id, orgName } = useParams();
    const { user, userToken } = useContext(CoreCtx);

    const surveyStore = useSurvey(
        userToken,
        survey_id,
        user,
    );

    const survey = surveyStore.value;

    if (!userToken || !orgName || !survey) {
        return null;
    }


    return (
        <div className="survey-wrapper">
            <Title style={{textAlign: 'center'}}>
                { survey.meta.name }
            </Title>
            <div className="survey-title">
                <PageBreadcrumbs orgName={ orgName } surveyName={ survey.meta.name } />
                <SurveyActions
                    surveyStore={surveyStore}
                />
            </div>

            <Switch>
                <Route exact={ true } path={ path } render={ () => (
                    <SurveySectionList
                        surveyStore={ surveyStore }
                        userToken={ userToken }
                        orgName={ orgName }
                    />
                ) }/>
                <Route exact={ true } path={ `${ path }/settings` } render={ () => (
                    <div/>
                ) }/>
                <Route exact={ true } path={ `${ path }/section/:section_index` } render={ () => (
                    <Sections
                        surveyStore={surveyStore}
                        userToken={userToken}
                    />
                ) }/>
            </Switch>

        </div>
    );
};
