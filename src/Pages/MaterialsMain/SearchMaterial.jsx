/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { useLocation } from "react-router-dom";
import useHandleSearch from "@/hook/useHandleSearch";
import { Input, AutoComplete, Button, Select } from "antd";
import {
  CloseCircleFilled,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import withDataFetching from "@/HOC/withDataFetching";

const url = ["/cms/material_categories"];

const SearchMaterial = ({ tableMaterialRef, state, fetchData }) => {
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
        allowClear={{
          clearIcon: <CloseCircleFilled />,
        }}
      />
      <AutoComplete
        className="custom-auto-complete w-64 h-7"
        placeholder="Search Category"
        value={valueCategory}
        onChange={(value) => setValueCategory(value)}
        options={
          state.error
            ? [
                {
                  value: "",
                  label: (
                    <div className="flex justify-between items-center">
                      <span>Error loading data</span>
                      <Button
                        danger
                        icon={<ReloadOutlined />}
                        className="ml-2"
                        size="small"
                        loading={state.loading}
                        onClick={(e) => {
                          e.stopPropagation();
                          fetchData();
                        }}
                      >
                        ReLoad
                      </Button>
                    </div>
                  ),
                },
              ]
            : dataCategorySearch.map((item) => ({
                value: item,
              }))
        }
        filterOption={(inputValue, option) =>
          option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
        allowClear={{
          clearIcon: <CloseCircleFilled />,
        }}
      />

      <Button
        icon={<SearchOutlined />}
        type="primary"
        className="h-7"
        htmlType="submit"
      />
    </form>
  );
};

export default withDataFetching(SearchMaterial, url);
