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
  part_number: yup.string().required("Price is required"),
  type: yup.number("type is number").required("Type is required"),
  large_title: yup.string().required("Large title is required"),
  small_title: yup.string().required("Small title is required"),
  basic_price: yup
    .number("Basic price is number")
    .required("Basic price is required"),
  category: yup.string().required("Category is required"),
  supplier: yup.string().required("Supplier is required"),
});

const ModalMaterial = forwardRef(({ dataEdit }, ref) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [modalVisible, setModalVisible] = useState(false);
  const [urlImage, setUrlImage] = useState(null);
  const [onClick, setOnClick] = useState(false);
  const [formData, setFormData] = useState({});
  const [dataCategory, setDataCategory] = useState([]);
  const [dataSupplier, setDataSupplier] = useState([]);
  const [count, setCount] = useState({
    category: 0,
    supplier: 0,
  });

  useEffect(() => {
    const getCountData = async () => {
      try {
        const params = {
          limit: 1,
        };
        const responseCategory = await requestApi(
          "/cms/material_categories",
          "get",
          null,
          params
        );
        setCount((prevCount) => ({
          ...prevCount,
          category: responseCategory.data.count,
        }));
        const responseSupplier = await requestApi(
          "/cms/supplier",
          "get",
          null,
          params
        );
        setCount((prevCount) => ({
          ...prevCount,
          supplier: responseSupplier.data.count,
        }));
      } catch (e) {
        console.error(error);
        navigate("/login");
      }
    };
    getCountData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const responseCategory = await requestApi(
          "/cms/material_categories",
          "get",
          null,
          {
            limit: count.category,
          }
        );
        setDataCategory(responseCategory.data.results);
        const responseSupplier = await requestApi(
          "/cms/supplier",
          "get",
          null,
          {
            limit: count.supplier,
          }
        );
        setDataSupplier(responseSupplier.data.results);
      } catch (e) {
        console.error(e);
        navigate("/login");
      }
    };
    getData();
  }, [count]);

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
      image: null,
      part_number: "",
      name: "",
      type: null,
      large_title: "",
      small_title: "",
      basic_price: null,
      category: "",
      supplier: "",
    },
  });

  useEffect(() => {
    if (dataEdit) {
      reset({
        name: dataEdit.name || "",
        image: dataEdit.image || null,
        part_number: dataEdit.part_number || "null",
        type: dataEdit.type || null,
        large_title: dataEdit.large_title || "",
        small_title: dataEdit.small_title || "",
        basic_price: dataEdit.basic_price || null,
        category: dataEdit.category || "",
        supplier: dataEdit.supplier || "",
      });
      setUrlImage(dataEdit.image || null);
    }
  }, [dataEdit, reset]);

  const onClickSubmit = (data) => {
    setOnClick(true);
    setFormData(data);
  };
  console.log(dataEdit);

  const onSubmit = async (dataSubmit) => {
    try {
      const formData = new FormData();

      dataSubmit.image !== dataSubmit.image &&
        formData.append("image", dataSubmit.image);
      formData.append("part_number", dataSubmit.part_number);
      formData.append("name", dataSubmit.name);
      formData.append("type", dataSubmit.type);
      formData.append("large_title", dataSubmit.large_title);
      formData.append("small_title", dataSubmit.small_title);
      formData.append("basic_price", dataSubmit.basic_price);
      formData.append("category", dataSubmit.category);
      formData.append("supplier", dataSubmit.supplier);

      if (dataEdit) {
        const response = await requestApi(
          `/cms/material/${dataEdit.id}`,
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
          <label>Part Number*: </label>
          <Controller
            control={control}
            name="part_number"
            render={({ field }) => (
              <Input placeholder="Part Number" {...field} />
            )}
          />
          {errors.part_number && (
            <p className="text-red-500">{errors.part_number.message}</p>
          )}
        </div>

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
          <label>Type*: </label>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Input type="number" placeholder="Type" {...field} />
            )}
          />
          {errors.type && <p className="text-red-500">{errors.type.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label>Large Title*: </label>
          <Controller
            control={control}
            name="large_title"
            render={({ field }) => (
              <Input placeholder="Large Title" {...field} />
            )}
          />
          {errors.large_title && (
            <p className="text-red-500">{errors.large_title.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label>Small Title*: </label>
          <Controller
            control={control}
            name="small_title"
            render={({ field }) => (
              <Input placeholder="Small Title" {...field} />
            )}
          />
          {errors.small_title && (
            <p className="text-red-500">{errors.small_title.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label>Basic Price*: </label>
          <Controller
            control={control}
            name="basic_price"
            render={({ field }) => (
              <Input placeholder="Basic Price" {...field} />
            )}
          />
          {errors.basic_price && (
            <p className="text-red-500">{errors.basic_price.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label>Category*: </label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                className="w-full"
                options={dataCategory.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                {...field}
              />
            )}
          />
          {errors.category && (
            <p className="text-red-500">{errors.category.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label>Supplier*: </label>
          <Controller
            name="supplier"
            control={control}
            render={({ field }) => (
              <Select
                className="w-full"
                options={dataSupplier.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                {...field}
              />
            )}
          />
          {errors.supplier && (
            <p className="text-red-500">{errors.supplier.message}</p>
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

export default ModalMaterial;
