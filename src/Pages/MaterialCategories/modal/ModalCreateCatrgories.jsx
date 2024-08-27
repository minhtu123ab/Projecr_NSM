/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import ModalCategory from "@/Pages/MaterialCategories/modal/ModalCategory";
import requestApi from "@/axios/axiosInstance";
import schema from "@/Pages/MaterialCategories/modal/schemaYup/schemaYupCategory";

const ModalCreateCategories = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [urlImage, setUrlImage] = useState(null);
  const [onClick, setOnClick] = useState(false);
  const [formData, setFormData] = useState({});

  const onClickSubmit = (data) => {
    setOnClick(true);
    setFormData(data);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      image: null,
      price_type: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("image", data.image);
      formData.append("name", data.name);
      formData.append("price_type", data.price_type);
      const response = await requestApi(
        "/cms/material_categories",
        "post",
        formData
      );
      if (response.status === 201) {
        enqueueSnackbar("Create successfully", {
          variant: "success",
        });
        navigate("/materials/categories");
      } else {
        enqueueSnackbar("Create Failed", {
          variant: "error",
        });
      }
      reset({ name: "", image: null, price_type: "" });
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
    <ModalCategory
      handleSubmit={handleSubmit}
      onClickSubmit={onClickSubmit}
      handleChangeImage={handleChangeImage}
      urlImage={urlImage}
      control={control}
      errors={errors}
      onClick={onClick}
    />
  );
};

export default ModalCreateCategories;
