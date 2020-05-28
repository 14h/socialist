import React, { useState } from 'react';
import './styles.css';
import { Button, Modal, Radio, Typography } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import { Item } from '../../types';

const { Title } = Typography;

export type TItemFormat =
    'page'
    | 'text'
    | 'multi'
    | 'multi-image'
    | 'rating'
    | 'rating-image'
    | 'images'
    | 'date'

const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
};

const ItemDescription = ({ selectedQuestion }: { selectedQuestion: Item['type'] | null }) => {
    switch (selectedQuestion) {
        case 'page':
            return (
                <div>
                    <Title level={3}>Page</Title>
                    <span>Beginning of a block, this doesn't have an answer, just text and images</span>
                </div>
            );
        case 'text':
            return (
                <div>
                    <Title level={3}>Text answer</Title>
                    <span>Users can enter a short phrase.</span>
                </div>
            );
        case 'multi':
            return (
                <div>
                    <Title level={3}>Multiple answer</Title>
                    <span>Users can select one or more options.</span>
                </div>
            );
        case 'multi-image':
            return (
                <div>
                    <Title level={3}>Multiple answers with image</Title>
                    <span>Users can select one or more options under an image.</span>
                </div>
            );
        case 'rating':
            return (
                <div>
                    <Title level={3}>Rating scale</Title>
                    <span>Users can answer with a 5 star rating scale (e.g. "Not interested" to "Very interested").</span>
                </div>
            );
        case 'rating-image':
            return (
                <div>
                    <Title level={3}>Rating scale with image</Title>
                    <span>Users can answer with a 5 star rating scale under an image.</span>
                </div>
            );
        case 'images':
            return (
                <div>
                    <Title level={3}>Side-by-side images</Title>
                    <span>Users can select one or more images.</span>
                </div>
            );
        case 'date':
            return (
                <div>
                    <Title level={3}>Date answer</Title>
                    <span>Users can select a specific date</span>
                </div>
            );
        default:
            return <div>
                <span>Select from items on the left to see the description</span>
            </div>;
    }
};

type SelectFormatModalProps = {
    callback: (selectedQuestion: Item['type']) => void;
    visible: boolean;
    onCancel: () => void;
}
export const SelectFormatModal = ({
    callback,
    visible,
    onCancel,
}: SelectFormatModalProps) => {
    const [selectedQuestion, setSelectedQuestion] = useState<Item['type'] | null>(null);

    return (
        <Modal
            title="Item format"
            visible={visible}
            onCancel={onCancel}
            width={800}
            footer={selectedQuestion &&
            <Button onClick={() => callback(selectedQuestion)}>{`Select ${selectedQuestion || ''}`}</Button>}
        >

            <div className='add-new-item-table'>

                <div style={{ borderRight: '1px solid #333' }}>
                    <Radio.Group
                        onChange={(e) => setSelectedQuestion(e.target.value)}
                        value={selectedQuestion}
                    >
                        <Radio style={radioStyle} value='page'>
                            Page
                        </Radio>
                        <Radio style={radioStyle} value='text'>
                            Text answer
                        </Radio>
                        <Radio style={radioStyle} value='multi'>
                            Multiple answers
                        </Radio>
                        <Radio style={radioStyle} value='multi-image'>
                            Multiple answers with an image
                        </Radio>
                        <Radio style={radioStyle} value='rating'>
                            Rating scale
                        </Radio>
                        <Radio style={radioStyle} value='rating-image'>
                            Rating scale with image
                        </Radio>
                        <Radio style={radioStyle} value='images'>
                            Side-by-side images
                        </Radio>
                        <Radio style={radioStyle} value='date'>
                            Date
                        </Radio>

                    </Radio.Group>
                </div>
                <ItemDescription
                    selectedQuestion={selectedQuestion}
                />
            </div>
            <hr/>
            <div>
                <WarningOutlined/>
                <span>Warning: Changing the question format will drop some of your question properties.</span>
            </div>
        </Modal>
    );
};

type AddItemProps = {
    callback: (selectedQuestion: Item['type']) => void;
    children: any;
    className: string;
}

export const ItemFormat = ({ callback, children, className }: AddItemProps) => {
    const [visible, setVisible] = useState(false);

    return (
        <div className={className}>
            <div onClick={() => setVisible(true)}>
                {children}
            </div>

            <SelectFormatModal
                callback={(type: Item['type']) => {
                    callback(type);
                    setVisible(false);
                }}
                visible={visible}
                onCancel={() => setVisible(false)}
            />
        </div>
    );
};
