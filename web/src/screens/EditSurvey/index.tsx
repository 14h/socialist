import React, { useContext, useState } from 'react';
import { Breadcrumb, Button, Layout, Tabs } from 'antd';
import { Item, Section } from '../../types';
import { useParams, useRouteMatch } from 'react-router';
import 'react-quill/dist/quill.snow.css';
import { SurveyActions } from './Components/SurveyActions';
import { SurveyStore, useSurvey } from '@utils/hooks';
import { SectionItem } from './Components/SectionItem';

import './styles.less';
import { CoreCtx } from '../../index';
import { Route, Switch } from 'react-router-dom';
import { SurveySectionList } from '../SurveySectionList';
import { HomeOutlined } from '@ant-design/icons';

const Sections = ({ surveyStore }: { surveyStore: SurveyStore }) => {
    const { section_index } = useParams();
    const [selectedItemIndex, setSelectedItemIndex] = useState(0);
    console.log('section_index', section_index)


    if (!section_index) {
        return null;
    }

    const section = surveyStore.value?.sections?.[Number(section_index)];
    console.log('section', section)


    return (
        <div className='section-tab'>
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
                            sectionIndex={ Number(section_index) }
                            itemIndex={ itemIndex }
                        />
                    </div>

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

    if (!userToken || !orgName) {
        return null;
    }

    return (
        <div className="survey-wrapper">
            <div className="survey-title">
                <PageBreadcrumbs orgName={ orgName } surveyName={ survey.meta.name } />
                <SurveyActions/>
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
                    <Sections surveyStore={ surveyStore }/>
                ) }/>
                <Route exact={ true } path={ `${ path }/section/:section_index` } render={ () => (
                    <Sections surveyStore={ surveyStore }/>
                ) }/>
            </Switch>

        </div>
    );
};
