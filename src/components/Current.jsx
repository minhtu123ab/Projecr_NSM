/* eslint-disable react/prop-types */
import { useState } from "react";
import { Select, Spin } from "antd";
import icon from "@/assets/icon.png";

const { Option } = Select;

const Current = ({ name, state }) => {
  const [day, setDay] = useState(30);

  const handleChange = (value) => {
    setDay(value);
  };

  return (
    <div className="w-72 h-36 bg-white shadow-md rounded-lg p-4 flex flex-col gap-2.5">
      <div className="flex justify-between items-center">
        <h2 className="text-sm text-gray-700 font-sans">Current {name}</h2>
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
        <img src={icon} alt="Icon" />
        {state?.loading ? (
          <Spin className="ml-2" />
        ) : (
          <p
            className="font-bold text-4xl text-[#8B96A7] font-sans"
            style={{
              fontFamily: "Arial",
            }}
          >
            {state?.total}
          </p>
        )}
      </div>
    </div>
  );
};

export default Current;
