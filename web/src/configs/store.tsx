import React from 'react';
import { TCoreCtxUseStateEnv } from '../types';

export const CoreCtx = React.createContext<TCoreCtxUseStateEnv>(null as never);

export const CoreProvider = (props: React.PropsWithChildren<{}>) => {
  // TODO figure out why store can't take TCoreCtxUseStateEnv as type
  const store: any = {
    auth: React.useState({
      userToken: 'foo'
    }),
    user: React.useState({
      id: '19h',
      username: '19h',
      email: 'kenan@sig.dev',
      firstname: 'Kenan',
      lastname: 'Sulayman'
    })
  };

  return <CoreCtx.Provider value={store}>{props.children}</CoreCtx.Provider>;
};
