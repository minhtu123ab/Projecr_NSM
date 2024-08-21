import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import requestApi from "@/axios/axiosInstance.js";

const useDeleteHandlers = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleDelete = async (
    itemToDelete,
    idDelete,
    setIdDelete,
    modalDeleteRef,
    endpoint
  ) => {
    if (itemToDelete) {
      try {
        await requestApi(`${endpoint}/${itemToDelete.id}`, "delete");
        enqueueSnackbar("Delete 1 Category Successfully", {
          variant: "success",
        });
        const newParams = new URLSearchParams(location.search);
        newParams.set("delete", new Date().getTime());
        navigate(`?${newParams.toString()}`);
        if (idDelete.includes(itemToDelete.id)) {
          setIdDelete((prevId) =>
            prevId.filter((id) => id !== itemToDelete.id)
          );
        }
      } catch (e) {
        console.log(e);
      } finally {
        modalDeleteRef.current.closeModal();
      }
    }
  };

  const deleteAll = async (
    idDelete,
    data,
    navigate,
    modalDeleteAllRef,
    enqueueSnackbar,
    setIdDelete,
    endpoint
  ) => {
    const results = idDelete.join(",");
    try {
      await requestApi(`${endpoint}/${results}`, "delete");
      enqueueSnackbar(`Delete ${idDelete.length} Categories Successfully`, {
        variant: "success",
      });
      const newParams = new URLSearchParams(location.search);
      const newPage = Number(newParams.get("page"));
      newParams.set("delete", new Date().getTime());
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
