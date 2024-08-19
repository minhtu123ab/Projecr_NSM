import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import { Controller, useForm } from "react-hook-form";
import requestApi from "@/axios/axiosInstance";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import { Input, Button, Upload, Select, Modal } from "antd";

const schema = yup.object().shape({
  image: yup.mixed().required("Image is required"),
  name: yup
    .string()
    .required("Name is required")
    .max(30, "Category name cannot be more than 30 characters"),
  price_type: yup.string().required("Price is required"),
});

const dataPriceType = [
  {
    id: "per_quantity",
    name: "Quantity",
  },
  {
    id: "per_metter",
    name: "Metter",
  },
];

const ModalCategories = forwardRef(({ dataEdit }, ref) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [modalVisible, setModalVisible] = useState(false);
  const [urlImage, setUrlImage] = useState(null);
  const [onClick, setOnClick] = useState(false);
  const [formData, setFormData] = useState({});

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  useImperativeHandle(ref, () => ({
    openModal,
  }));

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      image: null,
      price_type: "",
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

  const onClickSubmit = (data) => {
    setOnClick(true);
    setFormData(data);
  };

  const onSubmit = async (dataSubmit) => {
    try {
      const formData = new FormData();
      formData.append("name", dataSubmit.name);
      formData.append("price_type", dataSubmit.price_type);
      if (dataSubmit.image !== dataEdit?.image) {
        formData.append("image", dataSubmit.image);
      }
      if (dataEdit) {
        const response = await requestApi(
          `/cms/material_categories/${dataEdit.id}`,
          "put",
          formData
        );
        if (response.status === 200 || response.status === 204) {
          enqueueSnackbar("Update successfully", {
            variant: "success",
          });
          closeModal();
          const currentParams = new URLSearchParams(window.location.search);
          currentParams.set("updated_at", new Date().getTime());
          navigate(`?${currentParams.toString()}`);
        }
      } else {
        const response = await requestApi(
          "/cms/material_categories",
          "post",
          formData
        );
        if (response.status === 201) {
          enqueueSnackbar("Create successfully", {
            variant: "success",
          });
          closeModal();
          const currentParams = new URLSearchParams(window.location.search);
          currentParams.set("create_at", new Date().getTime());
          navigate(`?${currentParams.toString()}`);
        }
        reset({ name: "", image: null, price_type: "" });
      }
    } catch (e) {
      console.error(e);
      dataEdit
        ? enqueueSnackbar("Update Failed", {
            variant: "error",
          })
        : enqueueSnackbar("Create Failed", {
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
    <Modal
      title={dataEdit ? "Update Categories" : "Create Categories"}
      onOk={handleSubmit(onClickSubmit)}
      onCancel={closeModal}
      open={modalVisible}
      okType="primary"
      destroyOnClose
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <label>Name*: </label>
          <Controller
            control={control}
            name="name"
            render={({ field }) => <Input placeholder="Name" {...field} />}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label>Price Type*: </label>
          <Controller
            name="price_type"
            control={control}
            render={({ field }) => (
              <Select
                className="w-full"
                options={dataPriceType.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                {...field}
              />
            )}
          />
          {errors.price_type && (
            <p className="text-red-500">{errors.price_type.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <Upload
                customRequest={({ onSuccess }) => {
                  onSuccess("ok");
                }}
                showUploadList={false}
                onChange={handleChangeImage}
              >
                {!field.value ? (
                  <Button icon={<UploadOutlined />} type="primary">
                    Upload Image*
                  </Button>
                ) : (
                  <img
                    src={urlImage ? urlImage : field.value}
                    alt="Uploaded"
                    className="w-64 h-40 object-cover cursor-pointer"
                  />
                )}
              </Upload>
            )}
          />
          {errors.image && (
            <p className="text-red-500">{errors.image.message}</p>
          )}
        </div>
      </div>
    </Modal>
  );
});

export default ModalCategories;
