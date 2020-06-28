import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import '../styles.css';
import { Section } from '../../../types';

type TProps = {
    section: Section;
    setSection: (p: Section) => any;
}
export const LogicModal = (
    props: TProps
) => {
    const {section, setSection} = props;
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Button onClick={() => setShowModal(true)}>Change section logic</Button>

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
