import { useRef, useState } from "react";
import CurrentMaterials from "@/components/MaterialsMain/CurrentMaterials";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Button } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import TableMaterials from "@/components/MaterialsMain/TableMaterials";
import useHandleSearch from "../../hook/useHandleSearch";

const MaterialMain = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const nameParam = queryParams.get("name") || "";
  const categoryParam = queryParams.get("category") || "";

  const [valueCategory, setValueCategory] = useState(categoryParam);
  const [valueMaterial, setValueMaterial] = useState(nameParam);

  const navigate = useNavigate();

  const tableMaterialRef = useRef();

  const { handleSubmitMaterial } = useHandleSearch();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmitMaterial(e, valueMaterial, valueCategory, tableMaterialRef);
    }
  };

  return (
    <div className="p-7 bg-[#f1f5f9] h-full min-h-screen">
      <div className="flex flex-col gap-5 ml-52 mt-14">
        <CurrentMaterials />
        <h1 className="text-[#758398] font-sans text-3xl font-semibold">
          Main Material
        </h1>
        <div className="flex justify-between items-center">
          <form
            onSubmit={(e) =>
              handleSubmitMaterial(
                e,
                valueMaterial,
                valueCategory,
                tableMaterialRef
              )
            }
            className="flex gap-5"
          >
            <Input
              className="w-64 h-7 py-1 px-2 rounded-full"
              placeholder="Search name..."
              prefix={
                <SearchOutlined
                  style={{
                    opacity: 0.5,
                  }}
                />
              }
              value={valueMaterial}
              onChange={(e) => setValueMaterial(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Input
              className="w-64 h-7 py-1 px-2 rounded-full"
              placeholder="Search categories..."
              prefix={
                <SearchOutlined
                  style={{
                    opacity: 0.5,
                  }}
                />
              }
              value={valueCategory}
              onChange={(e) => setValueCategory(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </form>
          <Button
            onClick={() => navigate("/materials/main/created")}
            type="primary"
          >
            Create material
          </Button>
        </div>
        <TableMaterials ref={tableMaterialRef} />
      </div>
    </div>
  );
};

export default MaterialMain;
