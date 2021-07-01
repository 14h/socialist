import React from 'react';
import '../styles.less';
import { Button } from 'antd';
import { SurveyStore } from '@utils/hooks';

type TProps = {
    surveyStore: SurveyStore;
}

export const SurveyActions = (props: TProps) => {
    return (
        <div className="survey-actions"/>
    );
}
