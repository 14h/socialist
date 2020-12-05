import React from 'react';
import '../styles.css';
import { Button } from 'antd';

export const SurveyActions = () => (
    <div className="survey-actions">
        <Button onClick={console.log}>
            Share
        </Button>
        <Button onClick={console.log}>
            Results
        </Button>
        <Button onClick={console.log}>
            Export
        </Button>
        <Button type="ghost" onClick={console.log}>
            Close
        </Button>
        <Button type="primary" onClick={console.log}>
            Publish
        </Button>
    </div>
);
