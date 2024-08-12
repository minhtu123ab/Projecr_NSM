import { Input, Button, Upload, Select, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import axios from "axios";
import env from "../../Env";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import useRefeshToken from "../../hook/useRefeshToken";

const ModelEditCategory = ({ handleEdit, dataEdit, setOpenEdit }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState({
    image: dataEdit.image,
    name: dataEdit.name,
    price_type: dataEdit.price_type === "per_metter" ? "Metter" : "Quantity",
  });
  const [imageUrl, setImageUrl] = useState(null);

  const navigate = useNavigate();

  const handleInnerClick = (e) => {
    e.stopPropagation();
  };

  const handleInputChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value) => {
    setData({ ...data, price_type: value });
  };

  const handleUploadChange = (info) => {
    if (info.file && info.file.originFileObj) {
      const file = info.file.originFileObj;
      setData({ ...data, image: file });
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleEditClick = async () => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!data.name || !data.price_type) {
      enqueueSnackbar("Please enter complete information", {
        variant: "error",
      });
      return;
    }
    if (data.name.length > 30) {
      enqueueSnackbar("Categories name no more than 30 characters", {
        variant: "error",
      });
      return;
    }
    try {
      const formData = new FormData();
      data.image !== dataEdit.image && formData.append("image", data.image);
      formData.append("name", data.name);
      formData.append(
        "price_type",
        data.price_type === "Metter" ? "per_metter" : "per_quantity"
      );

      const response = await axios.put(
        env.urlServer + `/cms/material_categories/${dataEdit.id}`,
        formData,
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
        setImageUrl(null);
        setData({ image: null, name: "", price_type: "" });
        setOpenEdit(false);
        const time = new Date().getTime();
        navigate(`?updated_at=${time}`);
      } else {
        enqueueSnackbar("Update failed", {
          variant: "error",
        });
      }
    } catch (e) {
      if (e.response.status === 401) {
        const newToken = await useRefeshToken();
        if (newToken) {
          await handleEditClick();
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

  return (
    <div
      onClick={handleEdit}
      className="w-full h-full bg-[rgba(0,0,0,0.434)] flex justify-center items-center fixed top-0 left-0 z-[3]"
    >
      <div onClick={handleInnerClick} className="model-create-category">
        <h1 className="text-center font-sans text-[35px]">Update Category</h1>
        <div className="flex justify-center m-[20px]">
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
              {!data.image && (
                <UploadOutlined
                  style={{
                    fontSize: 80,
                  }}
                />
              )}
              {!data.image && <p>Upload Image*</p>}
              {data.image && (
                <img
                  src={imageUrl ? imageUrl : data.image}
                  alt="Uploaded"
                  className="w-full h-full object-cover"
                />
              )}
            </Button>
          </Upload>
        </div>
        <div className="flex flex-row gap-[15px] items-center">
          <div>
            <label>Name*: </label>
            <br />
            <Input
              placeholder="name"
              className="w-[300px] mt-[5px]"
              name="name"
              value={data.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Price_type*: </label>
            <br />
            <Space wrap>
              <Select
                className="w-[300px] mt-[5px]"
                options={[
                  { value: "Quantity", label: "Quantity" },
                  { value: "Metter", label: "Metter" },
                ]}
                value={data.price_type}
                onChange={handleSelectChange}
              />
            </Space>
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
          <Button type="primary" onClick={handleEditClick}>
            Update
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModelEditCategory;
