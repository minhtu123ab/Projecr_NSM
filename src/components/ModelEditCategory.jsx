import { Input, Button, Upload, Select, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import env from "../Env";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import useRefeshToken from "../hook/useRefeshToken";

const ModelEditCategory = ({ handleEdit, dataEdit, setOpenEdit }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState({
    image: dataEdit.image,
    name: dataEdit.name,
    price_type: dataEdit.price_type === "per_metter" ? "Metter" : "Quantity",
  });
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
      setData({ ...data, image: info.file.originFileObj });
    }
  };

  const handleEditClick = async () => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!data.name || !data.price_type) {
      toast.error("Please enter complete information");
      return;
    }
    if (data.name.length > 30) {
      toast.error("Categories name no more than 30 characters");
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
        setData({ image: null, name: "", price_type: "" });
        setOpenEdit(false);
        const time = new Date().getTime();
        navigate(`?updated_at=${time}`);
      } else {
        toast.error("Update failed");
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
        toast.error("Update failed");
        console.error(e);
      }
    }
  };

  return (
    <div onClick={handleEdit} className="background-model-create-category">
      <ToastContainer />
      <div onClick={handleInnerClick} className="model-create-category">
        <h1
          style={{
            textAlign: "center",
            fontFamily: "Arial, Helvetica, sans-serif",
          }}
        >
          Update Category
        </h1>
        <div style={{ display: "flex", justifyContent: "center", margin: 20 }}>
          <Upload
            customRequest={({ file, onSuccess }) => {
              setTimeout(() => {
                onSuccess("ok");
              }, 0);
            }}
            showUploadList={false}
            onChange={handleUploadChange}
          >
            <Button className="input-create-category">
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
                  src={data.image}
                  alt="Uploaded"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
            </Button>
          </Upload>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            alignItems: "center",
          }}
        >
          <div>
            <label>Name*: </label>
            <br />
            <Input
              placeholder="name"
              style={{ width: 300, marginTop: 5 }}
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
                style={{ width: 300, marginTop: 5 }}
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
        <div style={{ textAlign: "right", marginTop: 20 }}>
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
