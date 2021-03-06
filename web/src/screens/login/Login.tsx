import React, { useContext, useEffect, useState } from 'react';
import './styles.css';
import { Button, Form, Input, Modal, Row, Col } from 'antd';
import { CoreCtx } from '../../index';
import { createUser, login_so7, meApi } from '../../services/userService';
import { createOrganization } from '../../services/orgService';
import { addResourceUserRoles } from '../../services/surveyService';
import { Logo } from '@components/Logo';
import { Link } from 'react-router-dom';

type Props = {};

export const SignUp: React.FC<Props> = () => {
    const {login} = useContext(CoreCtx);

    const onFinish = async (values: any) => {
        const { email, password, firstname, lastname, orgName } = values;

        try {
            const newUser = await createUser(email, password, firstname, lastname);
            console.log(newUser);
            const newToken = await login_so7(email, password);
            if (!newToken) {
                throw new Error('failed to login with new account!');
            }
            const user = await meApi(newToken);
            if (!user) {
                throw new Error('failed to fetch user!');
            }

            const { id } = await createOrganization(orgName, newToken);

            await addResourceUserRoles(
                newToken,
                user.id,
                id,
                'ORG',
            );

            await login(email, password);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <Form
                labelCol={ { span: 24 } }
                wrapperCol={ { span: 24 } }
                layout="vertical"
                name="signup"
                initialValues={ { remember: false } }
                onFinish={ onFinish }
                onFinishFailed={ console.error }
            >
                <Row justify="space-between">
                    <Col span={ 11 }>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={ [{ required: true, message: 'Please input your email!' }] }
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col span={ 11 }>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={ [{ required: true, message: 'Please input your password!' }] }
                        >
                            <Input.Password/>
                        </Form.Item>
                    </Col>
                </Row>

                <Row justify="space-between">
                    <Col span={ 11 }>
                        <Form.Item
                            label="firstname"
                            name="firstname"
                            rules={ [{ required: true, message: 'Please input your firstname!' }] }
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col span={ 11 }>
                        <Form.Item
                            label="lastname"
                            name="lastname"
                            rules={ [{ required: true, message: 'Please input your lastname!' }] }
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>


                <hr/>
                <br/>
                <span>
                    You can have multiple organizations on your account.
                </span>
                <br/>
                <span>
                    For this registration process, you only need to provide the name of your organization.
                    You can edit this after login.
                </span>
                <br/><br/>
                <hr/>
                <br/>
                <Row justify="center">
                    <Col span={ 11 }>
                        <Form.Item
                            label="Organization name"
                            name="orgName"
                            rules={ [{ required: true, message: 'Please input your orgName!' }] }
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>


                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        SIGNUP
                    </Button>
                </Form.Item>
            </Form>
            <span>
                By clicking on "Create account" you agree to the terms of use and the privacy policy . You also consent to receive information and offers by email that concern our service. If necessary, you can unsubscribe from these emails under "My Account".
            </span>
        </div>
    );
};
export const Login: React.FC<Props> = () => {
    const {login} = useContext(CoreCtx);
    const [signUp, setSignUp] = useState(false);


    const onFinish = async (values: any) => {
        const { email, password } = values;
        await login(email, password);
    };

    return (
        <div className="login-form">
            <Link to="/surveys" className="logo">
                <Logo/>
                <h2>Socialist</h2>
            </Link>
            <Form
                labelCol={ { span: 24 } }
                wrapperCol={ { span: 24 } }
                name="login"
                initialValues={ { remember: true } }
                onFinish={ onFinish }
                onFinishFailed={ console.error }
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={ [{ required: true, message: 'Please input your email!' }] }
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={ [{ required: true, message: 'Please input your password!' }] }
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
                title="Registration"
                visible={ signUp }
                onCancel={ () => setSignUp(false) }
                footer={ null }
            >
                <SignUp/>
            </Modal>
            <div>
                Don't have an account yet?
                <div onClick={ () => setSignUp(true) }>
                    { ' ' }register
                </div>
            </div>

        </div>
    );
};
