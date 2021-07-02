import React, { useState } from 'react';
import '../styles.less';
import { Item } from '../../../types';
import { Button, Input, message, Modal } from 'antd';
import slugify from 'slugify';

// const itemDescription = {
//     'text': 'Users can enter a short phrase.',
//     'multi': 'Users can select one or more options.',
//     'rating': 'Users can answer with a 5 star rating scale (e.g. "Not interested" to "Very interested").',
//     'date': 'Users can select a specific date',
// };

type TProps = {
    callback: (selectedQuestion: Item['type'], name: string) => void;
}
export const AddItem = (props: TProps) => {
    const { callback } = props;
    const [visible, setVisible] = useState<boolean>(false);
    const [name, setName] = useState<string>('');

    const handleNameChange = (event: any) => {
        setName(slugify(event.target.value));
    };

    const addItem = (type: Item['type']) => {
        if (name.length < 8) {
            message.error('Question ID should be at least 8 characters');

            return;
        }

        callback(type, name);
        setVisible(false);
    }

    return (
        <div className='add-item'>
            <Button onClick={ () => setVisible(true) }>+</Button>

            <Modal
                title="Add question"
                visible={ visible }
                onCancel={ () => setVisible(false) }
                footer={ null }
            >
                <Input
                    placeholder="Question ID"
                    value={name}
                    onChange={handleNameChange}
                />
                <div className='add-item'>
                    <div onClick={ () => addItem('text') }>
                        Text answer
                    </div>
                    <div onClick={ () => addItem('multi') }>
                        Multiple answers
                    </div>
                    <div onClick={ () => addItem('rating') }>
                        Rating scale
                    </div>
                    <div onClick={ () => addItem('date') }>
                        Date
                    </div>
                    <div onClick={ () => addItem('number') }>
                        Number
                    </div>
                </div>
            </Modal>
        </div>
    );
};
