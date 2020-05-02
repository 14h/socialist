import React, { PropsWithChildren, useContext } from 'react';
import { CoreCtx } from './store';
import { Login } from '../screens/login/Login';
import { Layout } from 'antd';

import './root.css';
import { LayoutHeader } from '@layout/header';

type Props = PropsWithChildren<{}>;

export const Root = ({ children }: Props) => {
  const [user] = useContext(CoreCtx).user;
  console.log(user);

  if (user === null) {
    return <Login />;
  }

  return (
    <Layout>
      <LayoutHeader />
      {children}
    </Layout>
  );
};
