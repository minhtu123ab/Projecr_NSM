/* eslint-disable react/prop-types */
import { UploadOutlined } from "@ant-design/icons";
import { Button, Image, Upload } from "antd";
import { Controller } from "react-hook-form";

const ControllerImage = ({ control, handleChangeImage, urlImage, errors }) => {
  return (
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
                height={131}
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
                <Button icon={<UploadOutlined className="text-gray-600" />}>
                  Change Image
                </Button>
              </Upload>
            </div>
          )
        }
      />
      {errors.image && <p className="text-red-500">{errors.image.message}</p>}
    </div>
  );
};

export default ControllerImage;
