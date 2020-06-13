import React, { useContext, useState } from 'react';
import { Button, Form, Input, Modal } from 'antd';
import './styles.css';
import { surveyCtx } from './index';

export const ThemeModal = () => {
    const { themeStore } = useContext(surveyCtx)
    const [theme, setTheme] = themeStore;
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Button onClick={() => setShowModal(true)}>Theme</Button>

            <Modal
                title="Theme"
                visible={showModal}
                onCancel={() => setShowModal(false)}
                footer={null}
            >
                <Form
                    name="basic"
                    initialValues={theme}
                    onChange={console.log}
                    onFinish={setTheme}
                >
                    {
                        Object.keys(theme).map((t, i) => (
                            <Form.Item
                                key={i}
                                name={t}
                                label={t}
                                rules={[
                                    {
                                        required: true,
                                        whitespace: true,
                                        // message: 'Please input your a valid name for your survey!',
                                    },
                                ]}
                            >
                                <Input/>
                            </Form.Item>
                        ))
                    }
                    <Form.Item style={{ textAlign: 'center', marginTop: '60px' }}>
                        <Button type="primary" htmlType="submit" style={{ width: '40%' }}>
                            Update
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
