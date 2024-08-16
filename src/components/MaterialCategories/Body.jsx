import React, { useRef, useState } from "react";
import { Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import TableCategory from "./TableCategory";
import CurrentUsers from "./CurrentCategories";
import Navbar from "../Layout/Navbar";
import Menu from "../Layout/Menu";
import ModalCategories from "./modal/ModalCategories";

const Body = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const nameParam = queryParams.get("name") || "";

  const [value, setValue] = useState(nameParam);

  const modalOpenCreateRef = useRef();
  const tableCategoryRef = useRef();

  const handleOpenModalCreate = () => {
    modalOpenCreateRef.current.openModal();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newQueryParams = new URLSearchParams(location.search);
    if (value) {
      newQueryParams.set("name", value);
    } else {
      newQueryParams.delete("name");
    }
    newQueryParams.set("page", "0");
    navigate({ search: newQueryParams.toString() });

    if (tableCategoryRef.current) {
      tableCategoryRef.current.resetSelection();
    }
  };

  return (
    <div className="p-7 bg-[#f1f5f9] h-full min-h-screen">
      <Navbar />
      <Menu />
      <ModalCategories ref={modalOpenCreateRef} />
      <div className="flex flex-col gap-5 ml-52 mt-14">
        <CurrentUsers />
        <h1 className="text-[#758398] font-sans text-3xl font-semibold">
          Categories
        </h1>
        <div className="flex justify-between items-center">
          <form onSubmit={handleSubmit} className="flex gap-5">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-64 h-7 py-1 px-2 rounded-full"
              placeholder="Search..."
              prefix={<SearchOutlined className="opacity-50" />}
            />
          </form>
          <Button onClick={handleOpenModalCreate} type="primary">
            Create categories
          </Button>
        </div>
        <TableCategory ref={tableCategoryRef} /> {/* Thêm ref */}
      </div>
    </div>
  );
};

export default Body;
