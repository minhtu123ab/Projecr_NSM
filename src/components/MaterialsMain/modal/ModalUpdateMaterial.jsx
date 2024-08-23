/* eslint-disable react-hooks/exhaustive-deps */
import schema from "./schemaYup/schemaYupMaterial";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import requestApi from "@/axios/axiosInstance";
import ModalMaterials from "./ModalMaterials";
import { useState, useEffect } from "react";

const ModalUpdateMaterial = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id } = useParams();

  const [urlImage, setUrlImage] = useState(null);
  const [onClick, setOnClick] = useState(false);
  const [formData, setFormData] = useState({});
  const [dataEdit, setDataEdit] = useState({});

  const location = useLocation();

  useEffect(() => {
    const fetchDataItem = async () => {
      try {
        const responst = await requestApi(`/cms/material/${id}`, "get");
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
  });

  useEffect(() => {
    if (dataEdit) {
      reset({
        name: dataEdit.name || "",
        part_number: dataEdit.part_number || "",
        image: dataEdit.image || null,
        type: dataEdit.type || 0,
        large_title: dataEdit.large_title || "",
        basic_price: dataEdit.basic_price || null,
        small_title: dataEdit.small_title || "",
        category: dataEdit.category || "",
        supplier: dataEdit.supplier || "",
      });
      setUrlImage(dataEdit.image || null);
    }
  }, [dataEdit, reset]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      dataEdit.image != data.image && formData.append("image", data.image);
      formData.append("part_number", data.part_number);
      data.name && formData.append("name", data.name);
      data.type && formData.append("type", data.type);
      formData.append("basic_price", data.basic_price);
      formData.append("large_title", data.large_title);
      formData.append("small_title", data.small_title);
      formData.append("category", data.category);
      formData.append("supplier", data.supplier);
      const response = await requestApi(`/cms/material/${id}`, "put", formData);
      if (response.status === 200 || response.status === 204) {
        enqueueSnackbar("Update successfully", {
          variant: "success",
        });
        navigate(`/materials/main${location.search}`);
      } else {
        enqueueSnackbar("Update failed", { variant: "error" });
      }
      console.log("first");
    } catch (e) {
      console.error(e);
      enqueueSnackbar("Update Failed", {
        variant: "error",
      });
    } finally {
      setOnClick(false);
    }
  };

  const onClickSubmit = (data) => {
    setOnClick(true);
    setFormData(data);
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
      <ModalMaterials
        handleSubmit={handleSubmit}
        onClickSubmit={onClickSubmit}
        handleChangeImage={handleChangeImage}
        urlImage={urlImage}
        control={control}
        errors={errors}
      />
    </div>
  );
};

export default ModalUpdateMaterial;
