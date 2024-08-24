import { useRef } from "react";
import { Button } from "antd";

import { useLocation, useNavigate } from "react-router-dom";
import TableCategory from "@/Pages/MaterialCategories/TableCategory";
import SearchCategory from "./SearchCategory";
import Current from "@/components/Current/Current";

const CategoryMain = () => {
  const navigate = useNavigate();

  const tableCategoryRef = useRef();

  const location = useLocation();

  return (
    <div className="p-7 bg-[#f1f5f9] h-full min-h-screen">
      <div className="flex flex-col gap-5 ml-52 mt-14">
        <Current url="/cms/material_categories" name="Category" />
        <h1 className="text-[#758398] font-sans text-3xl font-semibold">
          Categories
        </h1>
        <div className="flex justify-between items-center">
          <SearchCategory tableCategoryRef={tableCategoryRef} />
          <Button
            onClick={() =>
              navigate(`/materials/categories/created${location.search}`)
            }
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
