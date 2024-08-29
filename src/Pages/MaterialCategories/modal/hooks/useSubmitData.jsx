import requestApi from "@/axios/axiosInstance";
import { enqueueSnackbar } from "notistack";
import { useLocation, useNavigate } from "react-router-dom";

const useSubmitData = (setOnClick, id, dataEdit) => {
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price_type", data.price_type);
      dataEdit
        ? data.image != dataEdit.image && formData.append("image", data.image)
        : formData.append("image", data.image);
      const response = id
        ? await requestApi(`/cms/material_categories/${id}`, "put", formData)
        : await requestApi("/cms/material_categories", "post", formData);
      if (
        id
          ? response.status === 200 || response.status === 204
          : response.status === 201
      ) {
        enqueueSnackbar(id ? "Update Successfully" : "Create successfully", {
          variant: "success",
        });
        id
          ? navigate(`/materials/categories${location.search}`)
          : navigate("/materials/categories");
      } else {
        enqueueSnackbar(id ? "Update failed" : "Create Failed", {
          variant: "error",
        });
      }
    } catch (e) {
      console.error(e);
      enqueueSnackbar(id ? "Update failed" : "Create Failed", {
        variant: "error",
      });
    } finally {
      setOnClick(false);
    }
  };
  return onSubmit;
};

export default useSubmitData;
