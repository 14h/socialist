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

export type NumberItem = {
    type: 'number';
    name: string;
    title: string;
    minValue?: number;
    maxValue?: number;
};

export type DateItem = {
    type: 'date';
    name: string;
    title: string;
};

export type TextItem = {
    type: 'text';
    name: string;
    title: string;
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

export type MultiItem = {
    type: 'multi',
    name: string;
    title: string;
    maxOptions?: number;
    minOptions?: number;
    options?: ReadonlyArray<ImageOption | TextOption>
}
export type PageItem = {
    type: 'page',
    title: string;
    name: string;
    conditions?: Condition[];
}

export type MultiImageItem = {
    type: 'multi-image',
    title: string;
    name: string;
}

export type RatingItem = {
    type: 'rating',
    title: string;
    name: string;
}

export type RatingImageItem = {
    type: 'rating-image',
    title: string;
    name: string;
}

export type ImagesItem = {
    type: 'images',
    title: string;
    name: string;
}

export type Item = MultiItem
    | TextItem
    | DateItem
    | NumberItem
    | PageItem
    | MultiImageItem
    | RatingItem
    | RatingImageItem
    | ImagesItem;

export type Page = {
    name: string;
    title: string;
    conditions?: Condition[];
    questions: Item[];
};
export type Survey = {
    name: string;
    title: string;
    pages: Page[];
};
