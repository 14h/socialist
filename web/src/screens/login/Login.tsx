import React, {useContext, useEffect, useState} from 'react';

import './styles.css';
import { Redirect } from 'react-router';
import {Button, Form, Input, message, Modal, Spin} from 'antd';
import { CoreCtx } from '../../index';
import {createUser, login_so7, meApi, setUserMeta} from '../../services/userService';
import { LoadingOutlined } from '@ant-design/icons';
import {createOrganization} from "../../services/orgService";
import {addResourceUserRoles} from "../../services/surveyService";
import {Logo} from "@components/Logo";
import {Link} from "react-router-dom";

type Props = {};

export const SignUp: React.FC<Props> = () => {
    const [, setUser] = useContext(CoreCtx).user;
    const [, setUserToken] = useContext(CoreCtx).userToken;

            const onFinish = async (values: any) => {
                const {email, password, firstname, lastname, orgName} = values;

                try {
                    const newUser = await createUser(email, password, firstname, lastname);
                    console.log(newUser);
                    const newToken = await login_so7(email, password);
                    if (!newToken) {
                        throw new Error('failed to login with new account!');
                    }
                    const user = await meApi(newToken);

                    const newOrgId = await createOrganization(orgName, newToken);

                    if (!newOrgId) {
                        throw new Error('failed to create org!');
                    }

                    await addResourceUserRoles(
                        newToken,
                        user.id,
                        newOrgId,
                        'ORG'
                    );

                    setUser(user);
                    setUserToken(newToken);
                } catch (error) {
                    console.error(error)
                }
            }

    return (
        <Form
            labelCol={{ span: 24 }}
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

            <Form.Item
                label="firstname"
                name="firstname"
                rules={[{ required: true, message: 'Please input your firstname!' }]}
            >
                <Input/>
            </Form.Item>

            <Form.Item
                label="lastname"
                name="lastname"
                rules={[{ required: true, message: 'Please input your lastname!' }]}
            >
                <Input/>
            </Form.Item>

            <Form.Item
                label="orgName"
                name="orgName"
                rules={[{ required: true, message: 'Please input your orgName!' }]}
            >
                <Input/>
            </Form.Item>


            <Form.Item>
                <Button type="primary" htmlType="submit">
                    SIGNUP
                </Button>
            </Form.Item>
        </Form>
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

    return (
        <div className="login-form">
            <Link to="/surveys" className="logo">
                <Logo />
            </Link>
            <Form
                labelCol={{ span: 24 }}
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
            <Modal
                title="Sign up"
                visible={signUp}
                onCancel={() => setSignUp(false)}
                footer={null}
            >
                <SignUp />
            </Modal>
            <a href="#" onClick={() => setSignUp(true)}>
                create new organization and account
            </a>
        </div>
    );
};
