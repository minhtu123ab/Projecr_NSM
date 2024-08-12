import { Input, Button, Upload, Select, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import axios from "axios";
import env from "../../Env";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import useRefeshToken from "../../hook/useRefeshToken";

const ModelCreateCategory = ({ handleCreate }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState({
    image: null,
    name: "",
    price_type: "",
  });
  const [imageUrl, setImageUrl] = useState(null); // Thêm state cho URL ảnh
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
      setImageUrl(URL.createObjectURL(file)); // Tạo URL cho ảnh
    }
  };

  const handleCreateClick = async () => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!data.image || !data.name || !data.price_type) {
      enqueueSnackbar("Please enter full information", {
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
      formData.append("image", data.image);
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
        enqueueSnackbar(`Create Successfully`, {
          variant: "success",
        });
        setData({ image: null, name: "", price_type: "" });
        setImageUrl(null); // Xóa URL ảnh sau khi tạo thành công
        handleCreate();
        const time = response.data.created_at;
        navigate(`?create_at=${time}`);
      } else {
        enqueueSnackbar("Create Failed", {
          variant: "error",
        });
      }
    } catch (e) {
      if (e.response.status === 401) {
        const newToken = await useRefeshToken();
        if (newToken) {
          await handleCreateClick();
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

  return (
    <div onClick={handleCreate} className="background-model-create-category">
      <div onClick={handleInnerClick} className="model-create-category">
        <h1
          style={{
            textAlign: "center",
            fontFamily: "Arial, Helvetica, sans-serif",
          }}
        >
          Create Category
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
                  src={imageUrl}
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
            flexDirection: "row",
            gap: 15,
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
                  { value: "per_quantity", label: "Quantity" },
                  { value: "per_metter", label: "Metter" },
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
            onClick={handleCreate}
            type="primary"
            danger
          >
            Cancel
          </Button>
          <Button type="primary" onClick={handleCreateClick}>
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModelCreateCategory;
