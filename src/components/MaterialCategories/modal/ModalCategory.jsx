/* eslint-disable react/prop-types */
import { Input, Image, Button, Upload, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

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

const ModalCategory = ({
  handleSubmit,
  onClickSubmit,
  handleChangeImage,
  urlImage,
  control,
  errors,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="p-7 bg-[#F1F5F9] h-full min-h-screen">
      <div className="pl-36 pt-20">
        {id ? (
          <h1 className="text-center text-4xl pb-10">Update Categories</h1>
        ) : (
          <h1 className="text-center text-4xl pb-10">
            Create a new Categories
          </h1>
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
                        className="mx-5 my-5 bg-gray-200 cursor-pointer rounded-2xl"
                        customRequest={({ onSuccess }) => {
                          onSuccess("ok");
                        }}
                        showUploadList={false}
                        onChange={handleChangeImage}
                      >
                        <UploadOutlined className="text-gray-600 text-7xl px-20 py-8" />
                      </Upload>
                    ) : (
                      <div className="mx-5 my-5 cursor-pointer rounded-2xl flex flex-col items-center gap-2">
                        <Image
                          width={232}
                          height={130}
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
            <div className="bg-white shadow-lg shadow-slate-700 flex flex-col justify-around px-10 rounded-3xl w-5/12">
              <div className="flex flex-col gap-3">
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
                  <label htmlFor="price_type">
                    Price Type<span className="text-red-600">*</span>
                  </label>
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

export default ModalCategory;
