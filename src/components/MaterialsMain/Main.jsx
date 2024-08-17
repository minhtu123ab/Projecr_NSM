import React, { useState, useEffect } from "react";
import CurrentMaterials from "@/components/MaterialsMain/CurrentMaterials";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import TableMaterials from "@/components/MaterialsMain/TableMaterials";
import CreateMaterial from "@/components/MaterialsMain/CreateMaterial";

const Main = () => {
  const [valueCategory, setValueCategory] = useState("");
  const [valueMaterial, setValueMaterial] = useState("");
  const [openCreate, setOpenCreate] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    navigate({ search: "" });
  }, [navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const queryParams = new URLSearchParams();
    if (valueCategory && valueMaterial) {
      queryParams.set("name", valueMaterial);
      queryParams.set("category", valueCategory);
    } else if (valueCategory) {
      queryParams.set("category", valueCategory);
    } else if (valueMaterial) {
      queryParams.set("name", valueMaterial);
    }
    navigate({ search: queryParams.toString() });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleCreate = () => {
    setOpenCreate(!openCreate);
  };

  return (
    <div className="p-[30px] bg-[#f1f5f9] h-full min-h-screen">
      {openCreate && <CreateMaterial handleCreate={handleCreate} />}
      <div className="flex flex-col gap-[20px] ml-[210px] mt-[55px]">
        <CurrentMaterials />
        <h1 className="text-[#758398] font-sans text-[30px] font-semibold">
          Main Material
        </h1>
        <div className="flex justify-between items-center">
          <form onSubmit={handleSubmit} className="flex gap-[20px]">
            <Input
              className="w-[250px] h-[28px] py-[4px] px-[8px] rounded-full"
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
              className="w-[250px] h-[28px] py-[4px] px-[8px] rounded-full"
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
          <Button onClick={handleCreate} type="primary">
            Create material
          </Button>
        </div>
        <TableMaterials />
      </div>
    </div>
  );
};

export default Main;
