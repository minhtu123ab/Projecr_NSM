/* eslint-disable react/prop-types */
import { Button } from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ControllerImage from "@/components/ControllerTags/ControllerImage";
import ControllerInput from "@/components/ControllerTags/ControllerInput";
import ControllerSelect from "@/components/ControllerTags/ControllerSelect";
import data from "@/Pages/MaterialCategories/modal/data/data.json";

const dataPriceType = data.dataPriceType;

const ModalCategory = ({
  handleSubmit,
  onClickSubmit,
  handleChangeImage,
  urlImage,
  control,
  errors,
  onClick,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const location = useLocation();

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
              <ControllerImage
                control={control}
                handleChangeImage={handleChangeImage}
                urlImage={urlImage}
                errors={errors}
              />
            </div>
            <div className="bg-white shadow-lg shadow-slate-700 flex flex-col justify-around px-10 rounded-3xl w-5/12">
              <div className="flex flex-col gap-3">
                <ControllerInput
                  control={control}
                  errors={errors}
                  labelName="name"
                  name="Name"
                  require={true}
                  type="text"
                />
                <ControllerSelect
                  control={control}
                  data={dataPriceType}
                  errors={errors}
                  labelName="price_type"
                  name="Price Type"
                  require={true}
                />
              </div>
              <div className="flex justify-end gap-4">
                <Button
                  onClick={() =>
                    navigate(`/materials/categories${location.search}`)
                  }
                >
                  Cancel
                </Button>
                {id ? (
                  <Button
                    loading={onClick}
                    type="primary"
                    onClick={handleSubmit(onClickSubmit)}
                  >
                    Update
                  </Button>
                ) : (
                  <Button
                    loading={onClick}
                    type="primary"
                    onClick={handleSubmit(onClickSubmit)}
                  >
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
