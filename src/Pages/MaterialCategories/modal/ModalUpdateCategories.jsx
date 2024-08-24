/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import ModalCategory from "./ModalCategory";
import requestApi from "@/axios/axiosInstance";
import schema from "./schemaYup/schemaYupCategory";

const ModalUpdateCategories = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id } = useParams();

  const [urlImage, setUrlImage] = useState(null);
  const [onClick, setOnClick] = useState(false);
  const [formData, setFormData] = useState({});
  const [dataEdit, setDataEdit] = useState({});

  const location = useLocation();

  const onClickSubmit = (data) => {
    setOnClick(true);
    setFormData(data);
  };

  useEffect(() => {
    const fetchDataItem = async () => {
      try {
        const responst = await requestApi(
          `/cms/material_categories/${id}`,
          "get"
        );
        setDataEdit(responst.data);
      } catch (e) {
        console.log(e);
        navigate("/login");
      }
    };
    fetchDataItem();
  }, [id, navigate]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: dataEdit.name,
      image: dataEdit.image,
      price_type: dataEdit.price_type,
    },
  });

  useEffect(() => {
    if (dataEdit) {
      reset({
        name: dataEdit.name || "",
        image: dataEdit.image || null,
        price_type: dataEdit.price_type || "",
      });
      setUrlImage(dataEdit.image || null);
    }
  }, [dataEdit, reset]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price_type", data.price_type);
      data.image != dataEdit.image && formData.append("image", data.image);
      const response = await requestApi(
        `/cms/material_categories/${id}`,
        "put",
        formData
      );
      if (response.status === 200 || response.status === 204) {
        enqueueSnackbar("Update Successfully", {
          variant: "success",
        });
        navigate(`/materials/categories${location.search}`);
      } else {
        enqueueSnackbar("Update failed", {
          variant: "error",
        });
      }
      reset({ name: "", image: null, price_type: "" });
    } catch (e) {
      console.error(e);
      enqueueSnackbar("Update Failed", {
        variant: "error",
      });
    } finally {
      setOnClick(false);
    }
  };

  const handleChangeImage = (info) => {
    if (info.file && info.file.originFileObj) {
      const file = info.file.originFileObj;
      setValue("image", file, { shouldValidate: true });
      setUrlImage(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (onClick) {
      onSubmit(formData);
    }
  }, [onClick]);

  return (
    <div>
      <ModalCategory
        handleSubmit={handleSubmit}
        onClickSubmit={onClickSubmit}
        handleChangeImage={handleChangeImage}
        urlImage={urlImage}
        control={control}
        errors={errors}
        onClick={onClick}
      />
    </div>
  );
};

export default ModalUpdateCategories;
