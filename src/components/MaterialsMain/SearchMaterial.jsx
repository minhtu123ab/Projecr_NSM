/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { useLocation } from "react-router-dom";
import useHandleSearch from "../../hook/useHandleSearch";
import { Input, AutoComplete } from "antd";
import { CloseCircleFilled, SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import withDataFetching from "../HOC/withDataFetching";

const url = ["/cms/material_categories"];

const SearchMaterial = ({ tableMaterialRef, state }) => {
  const location = useLocation();
  const { handleSubmitMaterial } = useHandleSearch();
  const { data } = state;

  const dataCategory = data[url[0]] || [];

  const dataCategorySearch = [
    ...new Set(dataCategory.map((item) => item.name)),
  ];

  const queryParams = new URLSearchParams(location.search);
  const nameParam = queryParams.get("name") || "";
  const categoryParam = queryParams.get("category") || "";

  const [valueCategory, setValueCategory] = useState(categoryParam);
  const [valueMaterial, setValueMaterial] = useState(nameParam);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmitMaterial(e, valueMaterial, valueCategory, tableMaterialRef);
    }
  };

  return (
    <form
      onSubmit={(e) =>
        handleSubmitMaterial(e, valueMaterial, valueCategory, tableMaterialRef)
      }
      className="flex gap-2"
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
        allowClear={{
          clearIcon: <CloseCircleFilled />,
        }}
      />
      <AutoComplete
        className="w-64 h-7"
        placeholder="Search Category"
        value={valueCategory}
        onChange={(value) => setValueCategory(value)}
        options={dataCategorySearch.map((item) => ({
          value: item,
        }))}
        onKeyDown={handleKeyDown}
        filterOption={(inputValue, option) =>
          option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
        allowClear={{
          clearIcon: <CloseCircleFilled />,
        }}
      />
    </form>
  );
};

export default withDataFetching(SearchMaterial, url);
