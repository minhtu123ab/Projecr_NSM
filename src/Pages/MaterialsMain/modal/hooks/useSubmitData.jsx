import requestApi from "@/axios/axiosInstance";
import { enqueueSnackbar } from "notistack";
import { useLocation, useNavigate } from "react-router-dom";

const useSubmitData = (setOnClick, id, dataEdit) => {
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("part_number", data.part_number);
      data.name && formData.append("name", data.name);
      data.type && formData.append("type", data.type);
      formData.append("basic_price", data.basic_price);
      formData.append("large_title", data.large_title);
      formData.append("small_title", data.small_title);
      formData.append("category", data.category);
      formData.append("supplier", data.supplier);
      dataEdit
        ? data.image != dataEdit.image && formData.append("image", data.image)
        : formData.append("image", data.image);
      const response = id
        ? await requestApi(`/cms/material/${id}`, "put", formData)
        : await requestApi("/cms/material", "post", formData);
      if (
        id
          ? response.status === 200 || response.status === 204
          : response.status === 201
      ) {
        enqueueSnackbar(id ? "Update Successfully" : "Create successfully", {
          variant: "success",
        });
        id
          ? navigate(`/materials/main${location.search}`)
          : navigate("/materials/main");
      } else {
        enqueueSnackbar(id ? "Update failed" : "Create Failed", {
          variant: "error",
        });
      }
    } catch (e) {
      console.error(e);
      e.response.data.part_number
        ? enqueueSnackbar("Cannot duplicate Part Number", { variant: "error" })
        : enqueueSnackbar(id ? "Update failed" : "Create Failed", {
            variant: "error",
          });
    } finally {
      setOnClick(false);
    }
  };
  return onSubmit;
};

export default useSubmitData;
