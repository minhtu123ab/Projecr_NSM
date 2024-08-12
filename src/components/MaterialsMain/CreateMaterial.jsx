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
  const [count, setCount] = useState({
    category: 0,
    supplier: 0,
  });
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
    const getCountData = async () => {
      const token = JSON.parse(localStorage.getItem("token"));
      try {
        const responseCategory = await axios.get(
          env.urlServer + "/cms/material_categories",
          {
            headers: {
              Authorization: `Bearer ${token.access}`,
              "Content-Type": "application/json",
            },
            params: {
              limit: 1,
            },
          }
        );
        setCount((prevCount) => ({
          ...prevCount,
          category: responseCategory.data.count,
        }));
        const responseSupplier = await axios.get(
          env.urlServer + "/cms/supplier",
          {
            headers: {
              Authorization: `Bearer ${token.access}`,
              "Content-Type": "application/json",
            },
            params: {
              limit: 1,
            },
          }
        );
        setCount((prevCount) => ({
          ...prevCount,
          supplier: responseSupplier.data.count,
        }));
      } catch (e) {
        if (e.response.status === 401) {
          const newToken = await useRefeshToken();
          if (newToken) {
            await getCountData();
          } else {
            navigate("/login");
          }
        } else {
          console.error(error);
          navigate("/login");
        }
      }
    };
    getCountData();
  }, []);

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
            params: {
              limit: count.category,
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
            params: {
              limit: count.supplier,
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
  }, [count]);

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
      className="w-full h-full bg-[rgba(0,0,0,0.434)] flex justify-center items-center fixed top-0 left-0 z-[3]"
    >
      <div
        onClick={handleInnerClick}
        className="model-create-category h-[80%] overflow-y-scroll"
      >
        <h1 className="text-center font-sans text-[35px]">Create Material</h1>
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
                  src={imageUrl}
                  alt="Uploaded"
                  className="w-full h-full object-cover"
                />
              )}
            </Button>
          </Upload>
        </div>
        <div className="flex flex-row gap-[15px] items-center">
          <div>
            <div>
              <label>Part_number*: </label>
              <br />
              <Input
                placeholder="part_number"
                className="w-[300px] mt-[5px]"
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
                className="w-[300px] mt-[5px]"
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
                className="w-[300px] mt-[5px]"
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
                className="w-[300px] mt-[5px]"
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
                className="w-[300px] mt-[5px]"
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
                className="w-[300px] mt-[5px]"
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
                  className="w-[300px] mt-[5px]"
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
                  className="w-[300px] mt-[5px]"
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
        <div className="text-right mt-[20px]">
          <Button
            className="mr-[20px]"
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
