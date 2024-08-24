/* eslint-disable react/prop-types */
import { useState } from "react";
import { useLocation } from "react-router-dom";
import useHandleSearch from "../../hook/useHandleSearch";
import { Input } from "antd";
import { CloseCircleFilled, SearchOutlined } from "@ant-design/icons";

const SearchCategory = ({ tableCategoryRef }) => {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const nameParam = queryParams.get("name") || "";

  const [value, setValue] = useState(nameParam);

  const { handleSubmit } = useHandleSearch();

  return (
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
        allowClear={{
          clearIcon: <CloseCircleFilled />,
        }}
      />
    </form>
  );
};

export default SearchCategory;
