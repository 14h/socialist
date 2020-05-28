import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { ReactSortable } from 'react-sortablejs';
import { SurveyListItem } from './types';
import './styles.css';
import { SurveyStore } from './hooks';

export const MoveModal = ({ surveyStore }: { surveyStore: SurveyStore }) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Button onClick={() => setShowModal(true)}>
                Sort questions
            </Button>

            <Modal
                title="Sort questions"
                visible={showModal}
                onCancel={() => setShowModal(false)}
                footer={null}
            >
                <ReactSortable list={surveyStore.list} setList={surveyStore.setList} className='sider-list'>
                    {surveyStore.list.map((
                        item: SurveyListItem,
                        index: number,
                    ) => (
                        <div
                            className={`sider-item ${item.type === 'page' && 'sider-item-page'}`}
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
