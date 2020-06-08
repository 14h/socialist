import {Survey } from '../../types';
import { useLocalStorage } from '@utils/helpers';

export const SURVEY: Survey = {
    name: 'survey1',
    translationId: 'survey name',
    items: [
        {
            type: 'page',
            name: 'page1',
            translationId: '1',
            conditions: [],
        },
        {
            type: 'number',
            name: 'question1',
            translationId: '2',
            minValue: 0,
            maxValue: 10,
        },
        {
            type: 'text',
            name: 'question2',
            translationId: '3',
            minCharacters: 0,
            maxCharacters: 10,
        },
        {
            type: 'page',
            name: 'page2',
            translationId: '4',
            conditions: [],
        },
        {
            type: 'number',
            name: 'question21',
            translationId: '5',
            minValue: 0,
            maxValue: 10,
        },
        {
            type: 'number',
            name: 'question22',
            translationId: '6',
            minValue: 0,
            maxValue: 10,
        },
        {
            type: 'page',
            name: 'page3',
            translationId: '7',
            conditions: [],
        },
        {
            type: 'number',
            name: 'question31',
            translationId: '8',
            minValue: 0,
            maxValue: 10,
        },
        {
            type: 'number',
            name: 'question32',
            translationId: '9',
            minValue: 0,
            maxValue: 10,
        },
    ],
};

