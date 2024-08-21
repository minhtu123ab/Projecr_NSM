import { useState, useEffect } from "react";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import ModalCategory from "./ModalCategory";
import requestApi from "@/axios/axiosInstance";

const schema = yup.object().shape({
  image: yup.mixed().required("Image is required"),
  name: yup
    .string()
    .required("Name is required")
    .max(30, "Category name cannot be more than 30 characters"),
  price_type: yup.string().required("Price is required"),
});

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
        navigate(-1);
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
    />
  );
};

export default ModalCreateCategories;
