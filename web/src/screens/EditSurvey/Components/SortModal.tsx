import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { ReactSortable } from 'react-sortablejs';
import '../styles.css';
import { Item } from '../../../types';

type TProps = {
    items: Item[];
    updateItems: (newItems: Item[]) => any;
}
export const SortModal = (
    props: TProps
) => {
    const {items, updateItems} = props;
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Button onClick={() => setShowModal(true)}>Sort items</Button>

            <Modal
                title="Sort items"
                visible={showModal}
                onCancel={() => setShowModal(false)}
                footer={null}
            >
                <ReactSortable
                    list={items as any[]}
                    setList={updateItems as any}
                    className="sider-list"
                >
                    {items.map((
                        item: Item,
                        index: number,
                    ) => (
                        <div
                            className="sider-item"
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
