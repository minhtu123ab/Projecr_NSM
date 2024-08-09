import React, { useEffect, useState } from "react";
import { Select } from "antd";
import icon from "../../assets/icon.png";
import { useLocation } from "react-router-dom";
import axios from "axios";
import env from "../../Env";
import useRefeshToken from "../../hook/useRefeshToken";

const { Option } = Select;

const CurrentUsers = () => {
  const [count, setCount] = useState(0);
  const [day, setDay] = useState(30);
  const [valueDelete, setValueDelete] = useState("");
  const [valueCreate, setValueCreate] = useState("");

  const location = useLocation();

  const handleChange = (value) => {
    setDay(value);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setValueDelete(queryParams.get("delete"));
    setValueCreate(queryParams.get("create_at"));
  }, [location.search]);

  useEffect(() => {
    const getCountData = async () => {
      const token = JSON.parse(localStorage.getItem("token"));
      try {
        const response = await axios.get(
          env.urlServer + "/cms/material_categories",
          {
            headers: {
              Authorization: `Bearer ${token.access}`,
              "Content-Type": "application/json",
            },
            params: {
              limit: 1,
            },
          }
        );
        setCount(response.data.count);
      } catch (e) {
        if (e.response.status === 401) {
          const newToken = await useRefeshToken();
          if (newToken) {
            await getCountData();
          } else {
            navigate("/login");
          }
        } else {
          console.error(error);
          navigate("/login");
        }
      }
    };
    getCountData();
  }, [valueCreate, valueDelete]);

  return (
    <div className="current-users">
      <div className="current-user-title">
        <h2 className="current-user-header">Current Categories</h2>
        <Select
          className="select-current-users"
          value={day}
          onChange={handleChange}
          style={{ width: 120 }}
        >
          <Option value={30}>30 day</Option>
          <Option value={20}>20 day</Option>
          <Option value={10}>10 day</Option>
        </Select>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <img src={icon} alt="" />
        <p
          style={{
            fontWeight: "bold",
            fontSize: 38,
            color: "#8B96A7",
            fontFamily: "Arial",
          }}
        >
          {count}
        </p>
      </div>
    </div>
  );
};

export default CurrentUsers;
