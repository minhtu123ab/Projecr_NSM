import { Input, Button, Upload, Select, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import axios from "axios";
import env from "../../Env";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import useRefeshToken from "../../hook/useRefeshToken";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";

const schema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .max(30, "Name cannot exceed 30 characters"),
  price_type: yup.string().required("Price type is required"),
  image: yup.mixed().required("Image is required"),
});

const ModelEditCategory = ({ handleEdit, dataEdit, setOpenEdit }) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(dataEdit.image || null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: dataEdit.name,
      price_type: dataEdit.price_type === "per_metter" ? "Metter" : "Quantity",
      image: dataEdit.image,
    },
  });

  const handleUploadChange = (info) => {
    if (info.file && info.file.originFileObj) {
      const file = info.file.originFileObj;
      setValue("image", file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleEditClick = async (formData) => {
    const token = JSON.parse(localStorage.getItem("token"));
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append(
        "price_type",
        formData.price_type === "Metter" ? "per_metter" : "per_quantity"
      );
      if (formData.image !== dataEdit.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await axios.put(
        env.urlServer + `/cms/material_categories/${dataEdit.id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token.access}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 204) {
        enqueueSnackbar(`Update Successfully`, {
          variant: "success",
        });
        setOpenEdit(false);
        navigate(`?updated_at=${new Date().getTime()}`);
      } else {
        enqueueSnackbar("Update failed", {
          variant: "error",
        });
      }
    } catch (e) {
      if (e.response.status === 401) {
        const newToken = await useRefeshToken();
        if (newToken) {
          handleEditClick(formData);
        } else {
          navigate("/login");
        }
      } else {
        enqueueSnackbar("Update failed", {
          variant: "error",
        });
        console.error(e);
      }
    }
  };

  const handleInnerClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={handleEdit}
      className="w-full h-full bg-[rgba(0,0,0,0.434)] flex justify-center items-center fixed top-0 left-0 z-[3]"
    >
      <div onClick={handleInnerClick} className="model-create-category">
        <h1 className="text-center font-sans text-[35px]">Update Category</h1>
        <form onSubmit={handleSubmit(handleEditClick)}>
          <div className="flex justify-center m-[20px]">
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <Upload
                  customRequest={({ file, onSuccess }) => {
                    setTimeout(() => {
                      onSuccess("ok");
                    }, 0);
                  }}
                  showUploadList={false}
                  onChange={handleUploadChange}
                >
                  <Button className="w-[300px] h-[200px] border border-dashed border-black text-[30px] rounded-[20px]">
                    {!field.value && (
                      <>
                        <UploadOutlined
                          style={{
                            fontSize: 80,
                          }}
                        />
                        <p>Upload Image*</p>
                      </>
                    )}
                    {field.value && (
                      <img
                        src={imageUrl ? imageUrl : field.value}
                        alt="Uploaded"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </Button>
                </Upload>
              )}
            />
            {errors.image && (
              <p className="text-red-500">{errors.image.message}</p>
            )}
          </div>
          <div className="flex flex-row gap-[15px] items-center">
            <div>
              <label>Name*: </label>
              <br />
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="name"
                    className="w-[300px] mt-[5px]"
                    {...field}
                  />
                )}
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label>Price_type*: </label>
              <br />
              <Space wrap>
                <Controller
                  name="price_type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      className="w-[300px] mt-[5px]"
                      options={[
                        { value: "Quantity", label: "Quantity" },
                        { value: "Metter", label: "Metter" },
                      ]}
                      {...field}
                    />
                  )}
                />
              </Space>
              {errors.price_type && (
                <p className="text-red-500">{errors.price_type.message}</p>
              )}
            </div>
          </div>
          <div className="text-right mt-[20px]">
            <Button
              style={{ marginRight: 20 }}
              onClick={handleEdit}
              type="primary"
              danger
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModelEditCategory;
