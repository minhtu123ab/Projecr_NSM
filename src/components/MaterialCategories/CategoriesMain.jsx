import { useRef, useState } from "react";
import { Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import TableCategory from "@/components/MaterialCategories/TableCategory";
import CurrentUsers from "@/components/MaterialCategories/CurrentCategories";
import useHandleSearch from "@/hook/useHandleSearch";

const CategoryMain = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const nameParam = queryParams.get("name") || "";

  const navigate = useNavigate();

  const [value, setValue] = useState(nameParam);

  const tableCategoryRef = useRef();

  const { handleSubmit } = useHandleSearch();

  return (
    <div className="p-7 bg-[#f1f5f9] h-full min-h-screen">
      <div className="flex flex-col gap-5 ml-52 mt-14">
        <CurrentUsers />
        <h1 className="text-[#758398] font-sans text-3xl font-semibold">
          Categories
        </h1>
        <div className="flex justify-between items-center">
          <form
            onSubmit={(e) => handleSubmit(e, value, tableCategoryRef)}
            className="flex gap-5"
          >
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-64 h-7 py-1 px-2 rounded-full"
              placeholder="Search..."
              prefix={<SearchOutlined className="opacity-50" />}
            />
          </form>
          <Button
            onClick={() => navigate("/materials/categories/created")}
            type="primary"
          >
            Create categories
          </Button>
        </div>
        <TableCategory ref={tableCategoryRef} />
      </div>
    </div>
  );
};

export default CategoryMain;
