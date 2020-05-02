import React, { useContext } from 'react';

import './styles.css';
import { CoreCtx } from '../../configs/store';
import { Redirect } from 'react-router';
import { Form, Input, Button, message } from 'antd';

type Props = {};

const attemptLogin = async (email: string, password: string) => {
  // throw new Error('Login Error')

  return {
    id: '19h',
    username: '19h',
    email: 'kenan@sig.dev',
    firstname: 'Kenan',
    lastname: 'Sulayman'
  };
};


export const Login: React.FC<Props> = () => {
  const [user, setUser] = useContext(CoreCtx).user;

  if (user !== null) {
    return <Redirect to="/" />;
  }
  const login = async (
      email: string,
      password: string,
  ) => {
    if( !email || !password ) {
      return;
    }

    try {
      const user = await attemptLogin(email, password);

      setUser(user);

    } catch (error) {

      message.error( JSON.stringify(error?.message) )
    }
  };

  const onFinish = async (values: any) => {
    const {email, password} = values;
    await login(email, password);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="login-form">
      <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 24 }}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
      >
        <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>


        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
