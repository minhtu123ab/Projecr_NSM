import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import requestApi from "@/axios/axiosInstance.js";

const useDeleteHandlers = (endpoint, setCheckCallApi) => {
  const navigate = useNavigate();

  const handleDelete = async (
    itemToDelete,
    idDelete,
    data,
    setIdDelete,
    modalDeleteRef
  ) => {
    if (itemToDelete) {
      try {
        await requestApi(`${endpoint}/${itemToDelete.id}`, "delete");
        enqueueSnackbar(`Delete ${itemToDelete.name} Successfully`, {
          variant: "success",
        });
        setCheckCallApi((item) => !item);
        const newParams = new URLSearchParams(location.search);
        if (idDelete.includes(itemToDelete.id)) {
          setIdDelete((prevId) =>
            prevId.filter((id) => id !== itemToDelete.id)
          );
        }
        const newPage = Number(newParams.get("page"));
        newPage > 0 && data.length === 1 && newParams.set("page", newPage - 1);
        navigate(`?${newParams.toString()}`);
      } catch (e) {
        console.log(e);
      } finally {
        modalDeleteRef.current.closeModal();
      }
    }
  };

  const deleteAll = async (idDelete, data, modalDeleteAllRef, setIdDelete) => {
    const results = idDelete.join(",");
    try {
      await requestApi(`${endpoint}/bulk/${results}`, "delete");
      enqueueSnackbar(`Delete All Successfully`, {
        variant: "success",
      });
      setCheckCallApi((item) => !item);
      const newParams = new URLSearchParams(location.search);
      const newPage = Number(newParams.get("page"));
      setIdDelete([]);
      newPage > 0 &&
        idDelete.length === data.length &&
        newParams.set("page", newPage - 1);
      navigate(`?${newParams.toString()}`);
    } catch (e) {
      console.error(e);
    } finally {
      modalDeleteAllRef.current.closeModal();
    }
  };

  return { handleDelete, deleteAll };
};

export default useDeleteHandlers;
