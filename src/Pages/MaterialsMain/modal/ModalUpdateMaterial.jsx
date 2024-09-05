/* eslint-disable react-hooks/exhaustive-deps */
import schema from "@/Pages/MaterialsMain/modal/schemaYup/schemaYupMaterial";
import { useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import requestApi from "@/axios/axiosInstance";
import ModalMaterials from "@/Pages/MaterialsMain/modal/ModalMaterials";
import { useState, useEffect } from "react";
import useChangImage from "@/hook/useChangImage";
import useSubmitData from "@/Pages/MaterialsMain/modal/hooks/useSubmitData";

const ModalUpdateMaterial = () => {
  const { id } = useParams();

  const [onClick, setOnClick] = useState(false);
  const [formData, setFormData] = useState({});
  const [dataEdit, setDataEdit] = useState({});

  useEffect(() => {
    const fetchDataItem = async () => {
      try {
        const responst = await requestApi(`/cms/material/${id}`, "get");
        setDataEdit(responst.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchDataItem();
  }, [id]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { handleChangeImage, urlImage, setUrlImage } = useChangImage(setValue);

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

  const onSubmit = useSubmitData(setOnClick, id, dataEdit);

  const onClickSubmit = (data) => {
    setOnClick(true);
    setFormData(data);
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
        onClick={onClick}
      />
    </div>
  );
};

export default ModalUpdateMaterial;
