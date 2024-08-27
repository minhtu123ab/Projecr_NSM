import { useEffect, useImperativeHandle, useState } from "react";

const useSelectDelete = (data, ref) => {
  const [checkAll, setCheckAll] = useState(false);
  const [idDelete, setIdDelete] = useState([]);

  useEffect(() => {
    setCheckAll(idDelete.length > 0);
  }, [idDelete.length]);

  const onClickDeleteAll = () => {
    const newCheckAll = !checkAll;
    setCheckAll(newCheckAll);
    setIdDelete(newCheckAll ? data.map((item) => item.id) : []);
  };

  const onClickSelectDelete = (item) => {
    setIdDelete((prevId) => {
      const newIdDelete = prevId.includes(item.id)
        ? prevId.filter((id) => id !== item.id)
        : [...prevId, item.id];
      return newIdDelete;
    });
  };

  useImperativeHandle(ref, () => ({
    resetSelection: () => {
      setCheckAll(false);
      setIdDelete([]);
    },
  }));

  useImperativeHandle;

  return {
    checkAll,
    idDelete,
    setCheckAll,
    setIdDelete,
    onClickDeleteAll,
    onClickSelectDelete,
  };
};

export default useSelectDelete;
