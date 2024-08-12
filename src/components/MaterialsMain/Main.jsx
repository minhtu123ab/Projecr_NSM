import React, { useState, useEffect } from "react";
import CurrentMaterials from "./CurrentMaterials";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import TableMaterials from "./TableMaterials";
import CreateMaterial from "./CreateMaterial";

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
    <div className="body">
      {openCreate && <CreateMaterial handleCreate={handleCreate} />}
      <div className="body-children">
        <CurrentMaterials />
        <h1
          style={{
            fontFamily: "Arial, Helvetica, sans-serif",
            color: "#758398",
          }}
        >
          Main Material
        </h1>
        <div className="search-create-category">
          <form onSubmit={handleSubmit} className="form-search-material">
            <Input
              className="input-navbar"
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
              className="input-navbar"
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
