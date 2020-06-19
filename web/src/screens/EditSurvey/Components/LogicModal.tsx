import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import '../styles.css';
import { Section } from '../../../types';

type TProps = {
    page: Section;
    setPage: (p: Section) => any;
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
