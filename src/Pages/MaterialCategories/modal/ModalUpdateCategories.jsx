/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import ModalCategory from "@/Pages/MaterialCategories/modal/ModalCategory";
import requestApi from "@/axios/axiosInstance";
import schema from "@/Pages/MaterialCategories/modal/schemaYup/schemaYupCategory";
import useChangImage from "@/hook/useChangImage";
import useSubmitData from "@/Pages/MaterialCategories/modal/hooks/useSubmitData";

const ModalUpdateCategories = () => {
  const { id } = useParams();

  const [onClick, setOnClick] = useState(false);
  const [formData, setFormData] = useState({});
  const [dataEdit, setDataEdit] = useState({});

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

  const { handleChangeImage, urlImage, setUrlImage } = useChangImage(setValue);

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
      }
    };
    fetchDataItem();
  }, [id]);

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

  const onSubmit = useSubmitData(setOnClick, id, dataEdit);

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
