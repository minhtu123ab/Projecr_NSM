/* eslint-disable react/prop-types */
import { Input, Image, Button, Upload, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import requestApi from "@/axios/axiosInstance";
import { Controller } from "react-hook-form";

const ModalMaterials = ({
  control,
  handleSubmit,
  errors,
  urlImage,
  onClickSubmit,
  handleChangeImage,
}) => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [count, setCount] = useState({
    category: 0,
    supplier: 0,
  });
  const [dataCategory, setDataCategory] = useState([]);
  const [dataSupplier, setDataSupplier] = useState([]);

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
        console.error(e);
        navigate("/login");
      }
    };
    getCountData();
  }, [navigate]);

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
  }, [count, navigate]);

  return (
    <div className="p-7 bg-[#F1F5F9] h-full min-h-screen">
      <div className="pl-32 pt-20">
        {id ? (
          <h1 className="text-center text-4xl pb-10">Update Material</h1>
        ) : (
          <h1 className="text-center text-4xl pb-10">Create a new Material</h1>
        )}
        <form>
          <div className="flex w-full gap-10 justify-center">
            <div className="pb-20">
              <div className="bg-white shadow-lg shadow-slate-700 flex items-center rounded-3xl flex-col">
                <Controller
                  name="image"
                  control={control}
                  render={({ field }) =>
                    !field.value ? (
                      <Upload
                        className="mx-4 my-4 bg-gray-200 cursor-pointer rounded-2xl"
                        customRequest={({ onSuccess }) => {
                          onSuccess("ok");
                        }}
                        showUploadList={false}
                        onChange={handleChangeImage}
                      >
                        <UploadOutlined className="text-gray-600 text-7xl px-16 py-6" />
                      </Upload>
                    ) : (
                      <div className="mx-4 my-4 cursor-pointer rounded-2xl flex flex-col items-center gap-2">
                        <Image
                          width={200}
                          height={120}
                          className="rounded-2xl"
                          style={{ objectFit: "cover" }}
                          src={urlImage ? urlImage : field.value}
                          alt="Uploaded"
                        />
                        <Upload
                          className=""
                          customRequest={({ onSuccess }) => {
                            onSuccess("ok");
                          }}
                          showUploadList={false}
                          onChange={handleChangeImage}
                        >
                          <Button
                            icon={<UploadOutlined className="text-gray-600" />}
                          >
                            Change Image
                          </Button>
                        </Upload>
                      </div>
                    )
                  }
                />
                {errors.image && (
                  <p className="text-red-500">{errors.image.message}</p>
                )}
              </div>
            </div>
            <div className="bg-white shadow-lg shadow-slate-700 flex flex-col justify-around px-10 rounded-3xl w-6/12 p-5 gap-5">
              <div className="flex gap-4">
                <div className="flex flex-col gap-3 flex-1">
                  <div>
                    <label htmlFor="part_number">
                      Part Number<span className="text-red-600">*</span>
                    </label>
                    <Controller
                      control={control}
                      name="part_number"
                      render={({ field }) => (
                        <Input placeholder="Part Number" {...field} />
                      )}
                    />
                    {errors.part_number && (
                      <p className="text-red-500">
                        {errors.part_number.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="name">
                      Name<span className="text-red-600">*</span>
                    </label>
                    <Controller
                      control={control}
                      name="name"
                      render={({ field }) => (
                        <Input placeholder="Name" {...field} />
                      )}
                    />
                    {errors.name && (
                      <p className="text-red-500">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="type">
                      Type<span className="text-red-600">*</span>
                    </label>
                    <Controller
                      control={control}
                      name="type"
                      render={({ field }) => (
                        <Input type="number" placeholder="Type" {...field} />
                      )}
                    />
                    {errors.type && (
                      <p className="text-red-500">{errors.type.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="large_title">
                      Large Title<span className="text-red-600">*</span>
                    </label>
                    <Controller
                      control={control}
                      name="large_title"
                      render={({ field }) => (
                        <Input placeholder="Large Title" {...field} />
                      )}
                    />
                    {errors.large_title && (
                      <p className="text-red-500">
                        {errors.large_title.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 flex-1">
                  <div>
                    <label htmlFor="small_title">
                      Small Title<span className="text-red-600">*</span>
                    </label>
                    <Controller
                      control={control}
                      name="small_title"
                      render={({ field }) => (
                        <Input placeholder="Small Title" {...field} />
                      )}
                    />
                    {errors.small_title && (
                      <p className="text-red-500">
                        {errors.small_title.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="basic_price">
                      Basic Price<span className="text-red-600">*</span>
                    </label>
                    <Controller
                      control={control}
                      name="basic_price"
                      render={({ field }) => (
                        <Input
                          type="number"
                          placeholder="Basic Price"
                          {...field}
                        />
                      )}
                    />
                    {errors.basic_price && (
                      <p className="text-red-500">
                        {errors.basic_price.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="category">
                      Category<span className="text-red-600">*</span>
                    </label>
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

                  <div>
                    <label htmlFor="supplier">
                      Supplier<span className="text-red-600">*</span>
                    </label>
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
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <Button onClick={() => navigate(-1)}>Cancel</Button>

                {id ? (
                  <Button type="primary" onClick={handleSubmit(onClickSubmit)}>
                    Update
                  </Button>
                ) : (
                  <Button type="primary" onClick={handleSubmit(onClickSubmit)}>
                    Create
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalMaterials;
