import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import '../styles.css';
import { Page } from '../../../types';

type TProps = {
    page: Page;
    setPage: (p: Page) => any;
}
export const LogicModal = (
    props: TProps
) => {
    const {page, setPage} = props;
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Button onClick={() => setShowModal(true)}>Change logic</Button>

            <Modal
                title="Page logic"
                visible={showModal}
                onCancel={() => setShowModal(false)}
                footer={null}
            >
            </Modal>
        </>
    );
};
