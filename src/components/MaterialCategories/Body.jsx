import React, { useEffect, useState } from "react";
import { Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ModelCreateCategory from "./ModelCreateCategory";
import TableCategory from "./TableCategory";
import CurrentUsers from "./CurrentCategories";

const Body = () => {
  const [value, setValue] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ search: "" });
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (value) {
      queryParams.set("name", value);
    }
    navigate({ search: queryParams.toString() });
  };

  const handleCreate = () => {
    setOpenCreate(!openCreate);
  };

  return (
    <div className="p-[30px] bg-[#f1f5f9] h-full min-h-screen">
      {openCreate && <ModelCreateCategory handleCreate={handleCreate} />}
      <div className="flex flex-col gap-[20px] ml-[210px] mt-[55px]">
        <CurrentUsers />
        <h1 className="text-[#758398] font-sans text-[30px] font-semibold">
          Categories
        </h1>
        <div className="flex justify-between items-center">
          <form onSubmit={handleSubmit} className="flex gap-[20px]">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-[250px] h-[28px] py-[4px] px-[8px] rounded-full"
              placeholder="Search..."
              prefix={<SearchOutlined className="opacity-50" />}
            />
          </form>
          <Button onClick={handleCreate} type="primary">
            Create categories
          </Button>
        </div>
        <TableCategory />
      </div>
    </div>
  );
};

export default Body;
