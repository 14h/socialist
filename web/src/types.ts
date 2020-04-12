import { Dispatch, SetStateAction } from 'react';

export type TUserStateMeta = Shallow<{
    email: string;
    username: string;
    firstname: string;
    lastname: string;
}>;

export type TUserStateId = Shallow<{
    id: string;
}>;

export type TUserState =
    TUserStateMeta
    & TUserStateId

export type TCoreStateAuth = Shallow<{
    userToken: string;
}>;

export type TCoreState = {
    auth: TCoreStateAuth;
    user: TUserState | null;
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

export type NumberQuestion = {
    type: 'number';
    name: string;
    title?: string;
    minValue?: number;
    maxValue?: number;
};

export type DateQuestion = {
    type: 'date';
    name: string;
    title?: string;
};

export type TextQuestion = {
    type: 'text';
    name: string;
    title?: string;
    maxCharacters?: number;
    minCharacters?: number;
}

export type ImageOption = {
    type: 'image';
    name: string;
    url: string;
}
export type TextOption = {
    type: 'text';
    name: string;
    title: string;
}
export type MultiQuestion = {
    type: 'multi',
    name: string;
    title?: string;
    maxOptions?: number;
    minOptions?: number;
    options?: ReadonlyArray<ImageOption | TextOption>
}

export type Question = MultiQuestion | TextQuestion | DateQuestion | NumberQuestion;
export type Page = {
    name: string;
    title: string;
    conditions?: Condition[];
    questions: Question[];
};
export type Survey = {
    name: string;
    title: string;
    pages: Page[];
};
