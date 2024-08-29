/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { Button, Spin } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import withDataFetching from "@/HOC/withDataFetching";
import ControllerImage from "@/components/ControllerTags/ControllerImage";
import ControllerInput from "@/components/ControllerTags/ControllerInput";
import ControllerSelect from "@/components/ControllerTags/ControllerSelect";
import data from "@/Pages/MaterialsMain/modal/data/data.json";

const urls = data.urls;
const dataControllerInputLeft = data.dataControllerInputLeft;
const dataControllerInputRight = data.dataControllerInputRight;
const dataControllerSelect = data.dataControllerSelect;

const ModalMaterials = ({
  control,
  handleSubmit,
  errors,
  urlImage,
  onClickSubmit,
  handleChangeImage,
  state,
  fetchData,
  onClick,
}) => {
  const { id } = useParams();
  const { data, loading, error } = state;

  const navigate = useNavigate();

  const location = useLocation();

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center flex-col items-center h-screen">
        <Button danger icon={<ReloadOutlined />} onClick={fetchData}>
          Reload
        </Button>
      </div>
    );
  const dataControllerSelectRender = dataControllerSelect.map(
    (item, index) => ({ ...item, data: data[urls[index]] || [] })
  );
  console.log(dataControllerSelectRender);

  return (
    <div className="p-7 bg-[#F1F5F9] h-full min-h-screen">
      <div className="pl-32 pt-20">
        {id ? (
          <h1 className="text-center text-4xl pb-10">Update Material</h1>
        ) : (
          <h1 className="text-center text-4xl pb-10">Create a new Material</h1>
        )}
        <form>
          <div className="flex w-full gap-10 justify-center ml-5">
            <div className="pb-20">
              <ControllerImage
                control={control}
                handleChangeImage={handleChangeImage}
                urlImage={urlImage}
                errors={errors}
              />
            </div>
            <div className="bg-white shadow-lg shadow-slate-700 flex flex-col justify-around px-10 rounded-3xl w-6/12 p-5 gap-5">
              <div className="flex gap-4">
                <div className="flex flex-col gap-3 flex-1">
                  {dataControllerInputLeft.map((item, index) => (
                    <ControllerInput
                      key={index}
                      control={control}
                      errors={errors}
                      labelName={item.labelName}
                      name={item.name}
                      require={item.require}
                      type={item.type}
                    />
                  ))}
                </div>

                <div className="flex flex-col gap-3 flex-1">
                  {dataControllerInputRight.map((item, index) => (
                    <ControllerInput
                      key={index}
                      control={control}
                      errors={errors}
                      labelName={item.labelName}
                      name={item.name}
                      require={item.require}
                      type={item.type}
                    />
                  ))}
                  {dataControllerSelectRender.map((item, index) => (
                    <ControllerSelect
                      key={index}
                      control={control}
                      data={item.data}
                      errors={errors}
                      labelName={item.labelName}
                      name={item.name}
                      require={true}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <Button
                  onClick={() => navigate(`/materials/main${location.search}`)}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={handleSubmit(onClickSubmit)}
                  loading={onClick}
                >
                  {id ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withDataFetching(ModalMaterials, urls);
