import {Survey } from '../../types';

export const SURVEY: Survey = {
    name: 'survey1',
    translationId: 'survey name',
    items: [
        {
            type: 'page',
            name: 'page1',
            translationId: 'page1',
            conditions: [],
        },
        {
            type: 'number',
            name: 'question1',
            translationId: 'question title',
            minValue: 0,
            maxValue: 10,
        },
        {
            type: 'text',
            name: 'question2',
            translationId: 'question title2',
            minCharacters: 0,
            maxCharacters: 10,
        },
        {
            type: 'page',
            name: 'page2',
            translationId: 'page2',
            conditions: [],
        },
        {
            type: 'number',
            name: 'question21',
            translationId: 'question title222',
            minValue: 0,
            maxValue: 10,
        },
        {
            type: 'number',
            name: 'question22',
            translationId: 'question title22',
            minValue: 0,
            maxValue: 10,
        },
        {
            type: 'page',
            name: 'page3',
            translationId: 'page3',
            conditions: [],
        },
        {
            type: 'number',
            name: 'question31',
            translationId: 'question title222',
            minValue: 0,
            maxValue: 10,
        },
        {
            type: 'number',
            name: 'question32',
            translationId: 'question title22',
            minValue: 0,
            maxValue: 10,
        },
    ],
};

export const translations = [
    {
        key: '00001',
        en: 'Who am I?',
        de: 'Wer bin ich?',
    },
    {
        key: '00002',
        en: 'what am I doing?',
        de: 'Was mache ich?',
    },
];

