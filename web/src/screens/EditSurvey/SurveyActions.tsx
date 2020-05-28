import React from 'react';
import './styles.css';
import { MoveModal } from './MoveModal';
import { Button } from 'antd';
import { SurveyStore } from './hooks';

export const SurveyActions = ({ surveyStore }: { surveyStore: SurveyStore }) => (
    <div className="survey-actions">
        <MoveModal
            surveyStore={surveyStore}
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
