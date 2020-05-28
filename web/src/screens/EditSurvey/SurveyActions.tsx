import React from 'react';
import './styles.css';
import { MoveModal } from './MoveModal';
import { Button } from 'antd';

export const SurveyActions = ({ surveyListStore }: any) => (
    <div className="survey-actions">
        <MoveModal
            surveyListStore={surveyListStore}
        />
        <Button onClick={console.log}>
            Share
        </Button>
        <Button onClick={console.log}>
            Results
        </Button>
        <Button onClick={console.log}>
            Export
        </Button>
        <Button type="danger" onClick={console.log}>
            Close
        </Button>
        <Button type="primary" onClick={console.log}>
            Publish
        </Button>
    </div>
);
