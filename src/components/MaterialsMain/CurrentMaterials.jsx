import { useEffect, useState } from "react";
import { Select } from "antd";
import icon from "@/assets/icon.png";
import { useNavigate } from "react-router-dom";
import useQueryParams from "@/hook/useQueryParams.jsx";
import requestApi from "@/axios/axiosInstance.js";

const { Option } = Select;

const CurrentMaterials = () => {
  const [count, setCount] = useState(0);
  const [day, setDay] = useState(30);

  const queryParams = useQueryParams();

  const handleChange = (value) => {
    setDay(value);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const getCountData = async () => {
      try {
        const params = {
          limit: 1,
        };
        const response = await requestApi("/cms/material", "get", null, params);
        setCount(response.data.count);
      } catch (e) {
        console.error(e);
        navigate("/login");
      }
    };
    getCountData();
  }, [navigate, queryParams.create, queryParams.delete]);

  return (
    <div className="w-72 h-36 bg-white shadow-md rounded-lg p-4 flex flex-col gap-2.5">
      <div className="flex justify-between items-center">
        <h2 className="text-sm text-gray-700">Current Categories</h2>
        <Select
          className="w-24 h-8"
          value={day}
          onChange={handleChange}
          style={{ width: 120 }}
        >
          <Option value={30}>30 day</Option>
          <Option value={20}>20 day</Option>
          <Option value={10}>10 day</Option>
        </Select>
      </div>
      <div className="flex items-center gap-3">
        <img src={icon} alt="" />
        <p
          className="font-bold text-4xl text-[#8B96A7] font-sans"
          style={{
            fontFamily: "Arial",
          }}
        >
          {count}
        </p>
      </div>
    </div>
  );
};

export default CurrentMaterials;
