import React, { useState } from 'react';
import slugify from 'slugify';
import { Button, Input, message, Modal } from 'antd';


type TProps = {
    callback: (name: string) => void;
}

export const AddSection = (props: TProps) => {
    const { callback } = props;
    const [visible, setVisible] = useState<boolean>(false);
    const [name, setName] = useState<string>('');

    const handleNameChange = (event: any) => {
        setName(slugify(event.target.value));
    };

    const addSection = () => {
        if (name.length < 8) {
            message.error('Section ID should be at least 8 characters');

            return;
        }

        callback(name);
        setVisible(false);
    }

    return (
        <div className='add-item'>
            <Button onClick={ () => setVisible(true) }>+</Button>

            <Modal
                title="Add section"
                visible={ visible }
                onCancel={ () => setVisible(false) }
                footer={ null }
            >
                <Input
                    placeholder="Section ID"
                    value={name}
                    onChange={handleNameChange}
                />
                <Button
                    onClick={addSection}
                    disabled={name.length < 8}
                >
                    Add section
                </Button>
            </Modal>
        </div>
    );
};
