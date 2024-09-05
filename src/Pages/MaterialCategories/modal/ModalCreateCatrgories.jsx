/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ModalCategory from "@/Pages/MaterialCategories/modal/ModalCategory";
import schema from "@/Pages/MaterialCategories/modal/schemaYup/schemaYupCategory";
import useChangImage from "@/hook/useChangImage";
import useSubmitData from "@/Pages/MaterialCategories/modal/hooks/useSubmitData";

const ModalCreateCategories = () => {
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
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      image: null,
      price_type: "",
    },
  });

  const { handleChangeImage, urlImage } = useChangImage(setValue);

  const onSubmit = useSubmitData(setOnClick);

  useEffect(() => {
    if (onClick) {
      onSubmit(formData);
    }
  }, [onClick]);

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
