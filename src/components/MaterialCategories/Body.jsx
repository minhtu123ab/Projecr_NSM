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
  }, []);

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
    <div className="body">
      {openCreate && <ModelCreateCategory handleCreate={handleCreate} />}
      <div className="body-children">
        <CurrentUsers />
        <h1
          style={{
            fontFamily: " Arial, Helvetica, sans-serif",
            color: "#758398",
          }}
        >
          Categories
        </h1>
        <div className="search-create-category">
          <form onSubmit={handleSubmit}>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="input-navbar"
              placeholder="Search..."
              prefix={
                <SearchOutlined
                  style={{
                    opacity: 0.5,
                  }}
                />
              }
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
