import React, { useContext, useState } from 'react';
import { Button, Modal } from 'antd';
import { ReactSortable } from 'react-sortablejs';
import './styles.css';
import { Item } from '../../types';
import { surveyCtx } from './index';

export const MoveModal = () => {
    const { surveyStore } = useContext(surveyCtx)
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Button onClick={() => setShowModal(true)}>Sort questions</Button>

            <Modal
                title="Sort questions"
                visible={showModal}
                onCancel={() => setShowModal(false)}
                footer={null}
            >
                <ReactSortable
                    list={surveyStore.items}
                    setList={surveyStore.setItems}
                    className="sider-list"
                >
                    {surveyStore.items.map((
                        item: Item,
                        index: number,
                    ) => (
                        <div
                            className={`sider-item ${item.type === 'page' &&
                            'sider-item-page'}`}
                            key={`surveyListItem-${index}`}
                        >
                            <div className="survey-item-option">{item.name}</div>
                        </div>
                    ))}
                </ReactSortable>
            </Modal>
        </>
    );
};
