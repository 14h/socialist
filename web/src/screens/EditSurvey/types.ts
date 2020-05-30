import { Condition, Item, Survey } from '../../types';

export const SURVEY: Survey = {
    name: 'survey1',
    title: 'survey name',
    pages: [
        {
            name: 'page1',
            title: 'page1',
            conditions: [],
            questions: [
                {
                    type: 'number',
                    name: 'question1',
                    title: 'question title',
                    minValue: 0,
                    maxValue: 10,
                },
                {
                    type: 'text',
                    name: 'question2',
                    title: 'question title2',
                    minCharacters: 0,
                    maxCharacters: 10,
                },
            ],
        },
        {
            name: 'page2',
            title: 'page2',
            conditions: [],
            questions: [
                {
                    type: 'number',
                    name: 'question21',
                    title: 'question title222',
                    minValue: 0,
                    maxValue: 10,
                },
                {
                    type: 'number',
                    name: 'question22',
                    title: 'question title22',
                    minValue: 0,
                    maxValue: 10,
                },
            ],
        },
        {
            name: 'page3',
            title: 'page3',
            conditions: [],
            questions: [
                {
                    type: 'number',
                    name: 'question31',
                    title: 'question title222',
                    minValue: 0,
                    maxValue: 10,
                },
                {
                    type: 'number',
                    name: 'question32',
                    title: 'question title22',
                    minValue: 0,
                    maxValue: 10,
                },
            ],
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

