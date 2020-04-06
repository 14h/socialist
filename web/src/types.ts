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
