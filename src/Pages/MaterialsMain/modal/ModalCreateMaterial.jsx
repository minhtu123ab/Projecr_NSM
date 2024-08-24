/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import schema from "./schemaYup/schemaYupMaterial";
import { useSnackbar } from "notistack";
import requestApi from "@/axios/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ModalMaterials from "./ModalMaterials";

const ModalCreateMaterial = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [onClick, setOnClick] = useState(false);
  const [formData, setFormData] = useState({});
  const [urlImage, setUrlImage] = useState(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onClickSubmit = (data) => {
    setOnClick(true);
    setFormData(data);
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("image", data.image);
      formData.append("part_number", data.part_number);
      data.name && formData.append("name", data.name);
      data.type && formData.append("type", data.type);
      formData.append("basic_price", data.basic_price);
      formData.append("large_title", data.large_title);
      formData.append("small_title", data.small_title);
      formData.append("category", data.category);
      formData.append("supplier", data.supplier);
      const response = await requestApi("/cms/material", "post", formData);
      if (response.status === 201) {
        enqueueSnackbar("Create successfully", {
          variant: "success",
        });
        navigate("/materials/main");
      } else {
        enqueueSnackbar("Create failed", { variant: "error" });
      }
    } catch (e) {
      console.error(e);
      enqueueSnackbar("Create Failed", {
        variant: "error",
      });
    } finally {
      setOnClick(false);
    }
  };

  useEffect(() => {
    if (onClick) {
      onSubmit(formData);
    }
  }, [onClick]);

  const handleChangeImage = (info) => {
    if (info.file && info.file.originFileObj) {
      const file = info.file.originFileObj;
      setValue("image", file, { shouldValidate: true });
      setUrlImage(URL.createObjectURL(file));
    }
  };

  return (
    <ModalMaterials
      control={control}
      handleSubmit={handleSubmit}
      errors={errors}
      urlImage={urlImage}
      onClickSubmit={onClickSubmit}
      handleChangeImage={handleChangeImage}
      onClick={onClick}
    />
  );
};

export default ModalCreateMaterial;
