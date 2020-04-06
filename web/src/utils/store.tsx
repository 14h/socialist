import React from 'react';
import { TCoreCtxUseStateEnv } from '../types';

export const CoreCtx = React.createContext<TCoreCtxUseStateEnv>(
    null as never,
);

/* routing */

//const types: TCoreStateNavType[] = [
//    'survey',
//    'tx',
//    'people',
//];
//
//const variants: TCoreStateNavVariant[] = [
//    'new',
//    'view',
//    'list',
//];

export const CoreProvider = (props: React.PropsWithChildren<{}>) => {
    //const store: TCoreCtxUseStateEnv = {
    //    auth: React.useState({
    //        userToken: null,
    //    }),
    //    user: React.useState(null),
    //};

    const store: TCoreCtxUseStateEnv = {
        auth: React.useState({
            userToken: 'foo',
        }),
        user: React.useState({
            id: '19h',
            email: 'kenan@sig.dev',
            firstname: 'Kenan',
            lastname: 'Sulayman',
        }),
    };

    return <CoreCtx.Provider value={store}>
        {props.children}
    </CoreCtx.Provider>;
};
