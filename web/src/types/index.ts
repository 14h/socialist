import { Dispatch, SetStateAction } from 'react';
import { Translation } from '../screens/Translations';
import {User} from "./models/User";

export type TCoreState = {
    userToken: string | null;
    user: User | null;
    translations: Map<string, Translation>;
};

export type TUseStateEnvelope<T> = {
    [P in keyof T]: [T[P], Dispatch<SetStateAction<T[P]>>];
};

export type TCoreCtxUseStateEnv = TUseStateEnvelope<TCoreState>;

// util

export type Shallow<T> = {
    [P in keyof T]: T[P] | null;
};


// SURVEY types
export type ConditionType = '<' | '>' | '=' | '!';
export type QuestionKey = string;
export type QuestionAnswer = string;
export type Condition = [
    QuestionKey,
    ConditionType,
    QuestionAnswer
];

export type NumberItem = {
    type: 'number';
    name: string;
    description: TranslationRef;
    minValue?: number;
    maxValue?: number;
};

export type DateItem = {
    type: 'date';
    name: string;
    description: TranslationRef;
};

export type TextItem = {
    type: 'text';
    name: string;
    description: TranslationRef;
    maxCharacters?: number;
    minCharacters?: number;
}


export type MultiItemOption = {
    name: string;
    description: TranslationRef;
}

export type MultiItem = {
    type: 'multi',
    name: string;
    description: TranslationRef;
    maxOptions?: number;
    minOptions?: number;
    options?: ReadonlyArray<MultiItemOption>
}


export type RatingItem = {
    type: 'rating',
    description: TranslationRef;
    name: string;
}


export type ImagesItem = {
    type: 'images',
    description: TranslationRef;
    name: string;
}

export type Item = MultiItem
    | TextItem
    | DateItem
    | NumberItem
    | RatingItem
    | ImagesItem;

export type TranslationRef = string | null;


export type Section = {
    name: string;
    description: TranslationRef
    items: Item[];
    conditions?: Condition[];
}

export type Survey = {
    name: string;
    description: TranslationRef;
    sections: Section[];
};

