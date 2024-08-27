import { useRef, useState } from "react";

const useHandleModalDelete = () => {
  const [itemToDelete, setItemToDelete] = useState(null);

  const modalDeleteRef = useRef();
  const modalDeleteAllRef = useRef();

  const handleOpenModalDeleteAll = () => {
    modalDeleteAllRef.current.openModal();
  };

  const handleOpenModalDelete = (e, item) => {
    e.stopPropagation();
    setItemToDelete(item);
    modalDeleteRef.current.openModal();
  };

  return {
    itemToDelete,
    handleOpenModalDelete,
    handleOpenModalDeleteAll,
    modalDeleteRef,
    modalDeleteAllRef,
  };
};

export default useHandleModalDelete;
