/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import schema from "@/Pages/MaterialsMain/modal/schemaYup/schemaYupMaterial";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ModalMaterials from "@/Pages/MaterialsMain/modal/ModalMaterials";
import useChangImage from "@/hook/useChangImage";
import useSubmitData from "@/Pages/MaterialsMain/modal/hooks/useSubmitData";

const ModalCreateMaterial = () => {
  const [onClick, setOnClick] = useState(false);
  const [formData, setFormData] = useState({});

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { handleChangeImage, urlImage } = useChangImage(setValue);

  const onClickSubmit = (data) => {
    setOnClick(true);
    setFormData(data);
  };

  const onSubmit = useSubmitData(setOnClick);

  useEffect(() => {
    if (onClick) {
      onSubmit(formData);
    }
  }, [onClick]);

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
