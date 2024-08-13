import React, { useState } from "react";
import { Input, Button, Upload, Select, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import env from "../../Env";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import useRefeshToken from "../../hook/useRefeshToken";

const schema = yup.object().shape({
  name: yup
    .string()
    .max(30, "Categories name no more than 30 characters")
    .required("Name is required"),
  price_type: yup.string().required("Price type is required"),
  image: yup.mixed().required("Image is required"),
});

const ModelCreateCategory = ({ handleCreate }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [imageUrl, setImageUrl] = useState(null); // Thêm state cho URL ảnh
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleInnerClick = (e) => {
    e.stopPropagation();
  };

  const onSubmit = async (data) => {
    const token = JSON.parse(localStorage.getItem("token"));
    try {
      const formData = new FormData();
      formData.append("image", data.image[0]);
      formData.append("name", data.name);
      formData.append("price_type", data.price_type);

      const response = await axios.post(
        env.urlServer + "/cms/material_categories",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token.access}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        enqueueSnackbar("Create Successfully", {
          variant: "success",
        });
        setValue("image", null);
        setValue("name", "");
        setValue("price_type", "");
        setImageUrl(null); // Xóa URL ảnh sau khi tạo thành công
        handleCreate();
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.set("create_at", response.data.created_at);
        navigate(`?${currentParams.toString()}`);
      } else {
        enqueueSnackbar("Create Failed", {
          variant: "error",
        });
      }
    } catch (e) {
      if (e.response.status === 401) {
        const newToken = await useRefeshToken();
        if (newToken) {
          await onSubmit(data);
        } else {
          navigate("/login");
        }
      } else {
        console.error(e);
        enqueueSnackbar("Create Failed", {
          variant: "error",
        });
      }
    }
  };

  const handleUploadChange = (info) => {
    if (info.file && info.file.originFileObj) {
      const file = info.file.originFileObj;
      setValue("image", [file]);
      setImageUrl(URL.createObjectURL(file)); // Tạo URL cho ảnh
    }
  };

  return (
    <div
      onClick={handleCreate}
      className="w-full h-full bg-[rgba(0,0,0,0.434)] flex justify-center items-center fixed top-0 left-0 z-[3]"
    >
      <div onClick={handleInnerClick} className="model-create-category">
        <h1 className="text-center font-sans text-[35px]">Create Category</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
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
                    {!imageUrl && (
                      <>
                        <UploadOutlined
                          style={{
                            fontSize: 80,
                          }}
                        />
                        <p>Upload Image*</p>
                      </>
                    )}
                    {imageUrl && (
                      <img
                        src={imageUrl}
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
                        { value: "per_quantity", label: "Quantity" },
                        { value: "per_metter", label: "Metter" },
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
              className="mr-[20px]"
              onClick={handleCreate}
              type="primary"
              danger
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModelCreateCategory;
