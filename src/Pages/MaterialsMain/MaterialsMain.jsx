import { useRef } from "react";
import { Button } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import TableMaterials from "@/Pages/MaterialsMain/TableMaterials";
import SearchMaterial from "@/Pages/MaterialsMain/SearchMaterial";
import Current from "@/components/Current";

const MaterialMain = () => {
  const navigate = useNavigate();

  const tableMaterialRef = useRef();

  const location = useLocation();

  return (
    <div className="p-7 bg-[#f1f5f9] h-full min-h-screen">
      <div className="flex flex-col gap-5 ml-52 mt-14">
        <Current url="/cms/material" name="Material" />
        <h1 className="text-[#758398] font-sans text-3xl font-semibold">
          Main Material
        </h1>
        <div className="flex justify-between items-center">
          <SearchMaterial tableMaterialRef={tableMaterialRef} />
          <Button
            onClick={() =>
              navigate(`/materials/main/created${location.search}`)
            }
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
