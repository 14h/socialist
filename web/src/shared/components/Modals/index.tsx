import React, { useContext, useState } from 'react';
import { Button, Form, Input, message, Modal } from 'antd';

import './styles.less';
import { useHistory, useParams } from 'react-router';
import { PlusOutlined } from '@ant-design/icons';
import { createSurvey } from '../../../services/surveyService';
import { CoreCtx } from '../../../index';

const handleCreateSurvey = async (
    title: string,
    userToken: string,
    userId: string,
    orgId: string,
    history: any,
) => {
    const hide = message.loading('Creating survey..', 0);
    try {
        const newSurveyId = await createSurvey(title, userId, userToken, orgId);

        if (!newSurveyId) {
            message.error(`Survey couldn't be created!`);

            return;
        }

        hide();

        message.success(`${ title } got successfully created!`);

        history.push(`/${ orgId }/surveys/${ newSurveyId }`);
    } catch (error) {
        hide();
        message.error(`Failed to create ${ title }: ${ error.message }`);
    }
};


export const CreateSurveyModal = () => {
    const { orgId } = useParams();
    const [showAddModal, setShowAddModal] = useState(false);
    const history = useHistory();
    const { user, userToken } = useContext(CoreCtx);

    if (!userToken || !orgId || !user) {
        return null;
    }

    return (
        <>
            <div
                onClick={ () => setShowAddModal(true) }
                className="create-button"
            >
                <PlusOutlined/>
            </div>

            <Modal
                title="Create survey"
                visible={ showAddModal }
                onCancel={ () => setShowAddModal(false) }
                footer={ null }
            >
                <Form
                    name="basic"
                    initialValues={ { remember: true } }
                    onFinish={
                        (values: any) => handleCreateSurvey(
                            values.name,
                            user.id,
                            userToken,
                            orgId,
                            history,
                        )
                    }
                    onFinishFailed={ console.log }
                >
                    <Form.Item
                        name="name"
                        rules={ [
                            {
                                required: true,
                                whitespace: true,
                                message: 'Please input your a valid name for your survey!',
                            },
                        ] }
                        label="name"
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item style={ { textAlign: 'center', marginTop: '60px' } }>
                        <Button type="primary" htmlType="submit" style={ { width: '40%' } }>
                            Create
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
