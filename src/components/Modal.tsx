import React, { forwardRef, useImperativeHandle, useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

interface CustomModalProps {
    isOpen?: boolean;
    children: React.ReactNode;
    padding?: string;
    borderRadius?: string;
    width?: string;
    handleModalClose: () => void;
}

export interface CustomModalRef {
    handleOpenModal: () => void;
    handleCloseModal: () => void;
    isOpened: () => boolean;
}

const CustomModal = forwardRef<CustomModalRef, CustomModalProps>(
    ({ isOpen = false, children, padding, width, handleModalClose }, ref) => {
        const [modalIsOpen, setModalIsOpen] = useState<boolean>(isOpen);

        useImperativeHandle(ref, () => ({
            handleOpenModal() {
                setModalIsOpen(true);
            },
            handleCloseModal() {
                setModalIsOpen(false);
            },
            isOpened() {
                return modalIsOpen;
            },
        }));

        return (
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => {
                    setModalIsOpen(false);
                    handleModalClose();
                }}
                contentLabel="Example Modal"
                style={{
                    overlay: {
                        backgroundColor: "rgba(2, 21, 38, 0.7)",
                    },
                    content: {
                        top: "50%",
                        left: "50%",
                        right: "auto",
                        bottom: "auto",
                        transform: "translate(-50%, -50%)",
                        padding: padding,
                        border: 'none',
                        borderRadius: '4px',
                        width: width,
                        maxWidth: '800px',
                        maxHeight: '90vh'
                    },
                }}
            >
                {children}
            </Modal>
        );
    }
);

export default CustomModal;
