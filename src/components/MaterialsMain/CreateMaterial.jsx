import { Input, Button, Upload, Select, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import axios from "axios";
import env from "../../Env";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import useRefeshToken from "../../hook/useRefeshToken";

const CreateMaterial = ({ handleCreate }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [dataCategory, setDataCategory] = useState([]);
  const [dataSupplier, setDataSupplier] = useState([]);
  const [data, setData] = useState({
    image: null,
    part_number: "",
    name: "",
    type: null,
    large_title: "",
    small_title: "",
    basic_price: null,
    category: "",
    supplier: "",
  });
  const [imageUrl, setImageUrl] = useState(null); // Thêm state cho URL ảnh

  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      const token = JSON.parse(localStorage.getItem("token"));
      try {
        const responseCategory = await axios.get(
          env.urlServer + "/cms/material_categories",
          {
            headers: {
              Authorization: `Bearer ${token.access}`,
              "Content-Type": "application/json",
            },
          }
        );
        setDataCategory(responseCategory.data.results);
        const responseSupplier = await axios.get(
          env.urlServer + "/cms/supplier",
          {
            headers: {
              Authorization: `Bearer ${token.access}`,
              "Content-Type": "application/json",
            },
          }
        );
        setDataSupplier(responseSupplier.data.results);
      } catch (e) {
        if (e.response.status === 401) {
          const newToken = await useRefeshToken();
          if (newToken) {
            await getData();
          } else {
            navigate("/login");
          }
        } else {
          console.error(error);
          navigate("/login");
        }
      }
    };
    getData();
  }, []);

  const handleInnerClick = (e) => {
    e.stopPropagation();
  };

  const handleInputChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSelectChangeCategory = (value) => {
    setData({ ...data, category: value });
  };

  const handleSelectChangeSupplier = (value) => {
    setData({ ...data, supplier: value });
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
    if (
      !data.image ||
      !data.name ||
      !data.part_number ||
      !data.large_title ||
      !data.category ||
      !data.type ||
      !data.supplier ||
      !data.small_title ||
      !data.basic_price
    ) {
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
      formData.append("part_number", data.part_number);
      formData.append("name", data.name);
      formData.append("type", data.type);
      formData.append("large_title", data.large_title);
      formData.append("small_title", data.small_title);
      formData.append("basic_price", data.basic_price);
      formData.append("category", data.category);
      formData.append("supplier", data.supplier);

      const response = await axios.post(
        env.urlServer + "/cms/material",
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
        setImageUrl(null); // Xóa URL ảnh sau khi tạo thành công
        handleCreate();
        const time = new Date().getTime();
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
    <div
      onClick={handleCreate}
      className="background-model-create-category background-model-create-material"
    >
      <div
        onClick={handleInnerClick}
        className="model-create-category model-create-material"
      >
        <h1
          style={{
            textAlign: "center",
            fontFamily: "Arial, Helvetica, sans-serif",
          }}
        >
          Create Material
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
            alignItems: "center",
            gap: 15,
          }}
        >
          <div>
            <div>
              <label>Part_number*: </label>
              <br />
              <Input
                placeholder="part_number"
                style={{ width: 300, marginTop: 5 }}
                name="part_number"
                value={data.part_number}
                onChange={handleInputChange}
              />
            </div>
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
              <label>Type*: </label>
              <br />
              <Input
                type="number"
                placeholder="type"
                style={{ width: 300, marginTop: 5 }}
                name="type"
                value={data.type}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Large_title*: </label>
              <br />
              <Input
                placeholder="large_title"
                style={{ width: 300, marginTop: 5 }}
                name="large_title"
                value={data.large_title}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div>
            <div>
              <label>Small_title*: </label>
              <br />
              <Input
                placeholder="small_title"
                style={{ width: 300, marginTop: 5 }}
                name="small_title"
                value={data.small_title}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>basic_price*: </label>
              <br />
              <Input
                type="number"
                placeholder="basic_price"
                style={{ width: 300, marginTop: 5 }}
                name="basic_price"
                value={data.basic_price}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Category*: </label>
              <br />
              <Space wrap>
                <Select
                  style={{ width: 300, marginTop: 5 }}
                  options={dataCategory.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                  value={data.category}
                  onChange={handleSelectChangeCategory}
                />
              </Space>
            </div>
            <div>
              <label>Supplier*: </label>
              <br />
              <Space wrap>
                <Select
                  style={{ width: 300, marginTop: 5 }}
                  options={dataSupplier.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                  value={data.supplier}
                  onChange={handleSelectChangeSupplier}
                />
              </Space>
            </div>
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

export default CreateMaterial;
