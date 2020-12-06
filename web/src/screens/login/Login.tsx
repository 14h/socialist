import React, {useContext, useEffect, useState} from 'react';

import './styles.css';
import { Redirect } from 'react-router';
import { Button, Form, Input, message, Spin } from 'antd';
import { CoreCtx } from '../../index';
import {createUser, login_so7, meApi, setUserMeta} from '../../services/userService';
import { LoadingOutlined } from '@ant-design/icons';
import {createOrganization} from "../../services/orgService";
import {addResourceUserRoles} from "../../services/surveyService";

type Props = {};

export const SignUp: React.FC<Props> = () => {
    const [, setUser] = useContext(CoreCtx).user;
    const [, setUserToken] = useContext(CoreCtx).userToken;

    const onFinish = async (values: any) => {
        const {email, password, firstname, lastname, orgName} = values;

        try {
            const newUser = await createUser(email, password);
            console.log(newUser);
            const newToken = await login_so7(email, password);
            if (!newToken) {
                throw new Error('failed to login with new account!');
            }
            const user = await meApi(newToken);

            await setUserMeta(
                user.id,
                email,
                firstname,
                lastname
            );

            const newOrgId = await createOrganization(orgName, newToken);

            if (!newOrgId) {
                throw new Error('failed to create org!');
            }

            await addResourceUserRoles(
                newToken,
                user.id,
                newOrgId
            );

            setUser(newUser);
            setUserToken(newToken);
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="login-form">
            <Form
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 24 }}
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={console.error}
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
                        LOGIN
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
export const Login: React.FC<Props> = () => {
    const [user, setUser] = useContext(CoreCtx).user;
    const [userToken, setUserToken] = useContext(CoreCtx).userToken;
    const [signUp, setSignUp] = useState(false);

    useEffect(() => {
        // try using saved auth on first render
        if (!userToken) {
            return;
        }

        try {
            (async () => {
                const user = await meApi(userToken);

                if (!user) {
                    throw new Error('me endpoint didn\'t work ');
                }

                setUser(user);
            })();
        } catch (error) {
            console.log(error);
            setUserToken(null);
        }
    }, []);

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
            const newToken = await login_so7(email, password);

            if (!newToken) {
                throw new Error('Login failed')
            }

            const user = await meApi(newToken);

            if (!user) {
                throw new Error('me endpoint didn\'t work ');
            }

            setUser(user);
            setUserToken(newToken);

        } catch (error) {

            message.error(JSON.stringify(error?.message));
        }
    };

    const onFinish = async (values: any) => {
        const { email, password } = values;
        await login(email, password);
    };

    if (userToken) {
        // trying with the stored userToken

        return (
            <div className='loading-spinner'>

                <Spin
                    indicator={
                        <LoadingOutlined style={{ fontSize: 24 }} spin={ true } />
                    }
                />
            </div>
        )
    }

    if (signUp) {
        return <SignUp />;
    }

    return (
        <div className="login-form">
            <Form
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 24 }}
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={console.error}
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
                        LOGIN
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};
