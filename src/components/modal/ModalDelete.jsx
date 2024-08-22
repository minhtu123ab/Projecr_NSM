/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useState, useImperativeHandle, forwardRef } from "react";
import { Modal } from "antd";

const ModalDelete = forwardRef(({ onDelete, itemToDelete }, ref) => {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  useImperativeHandle(ref, () => ({
    openModal,
    closeModal,
  }));

  return (
    <Modal
      title={itemToDelete ? `Delete ${itemToDelete.name}` : "Delete All"}
      open={modalVisible}
      onOk={onDelete}
      onCancel={closeModal}
      okType="danger"
      destroyOnClose
    >
      {itemToDelete ? (
        <p>
          Are you sure you want to delete "
          <span className="font-medium">{itemToDelete.name}</span>"?
        </p>
      ) : (
        <p>Are you sure you want to delete All</p>
      )}
    </Modal>
  );
});

// Thêm displayName cho component
ModalDelete.displayName = "ModalDelete";

export default ModalDelete;
