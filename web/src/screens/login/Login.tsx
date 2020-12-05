import React, { useContext } from 'react';

import './styles.css';
import { Redirect } from 'react-router';
import { Button, Form, Input, message } from 'antd';
import { CoreCtx } from '../../index';
import {loginApi, meApi} from "../../services/userService";

type Props = {};


export const Login: React.FC<Props> = () => {
    const [user, setUser] = useContext(CoreCtx).user;

    if (user !== null) {
        return <Redirect to="/"/>;
    }
    const login = async (
        email: string,
        password: string,
    ) => {
        if (!email || !password) {
            return;
        }

        try {
            const userResponse = await loginApi(email, password);

            if (!userResponse?.userToken) {
                throw new Error('Login failed')
            }

            const user = await meApi(userResponse?.userToken);

            if (!user) {
                throw new Error('me endpoint didn\'t work ');
            }

            setUser(user);

        } catch (error) {

            message.error(JSON.stringify(error?.message));
        }
    };

    const onFinish = async (values: any) => {
        const { email, password } = values;
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
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password/>
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
