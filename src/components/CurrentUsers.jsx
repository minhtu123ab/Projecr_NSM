import React, { useState } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import icon from "../assets/icon.png";

const CurrentUsers = () => {
  const [day, setDay] = useState(30);
  const handleChange = (event) => {
    setDay(event.target.value);
  };
  return (
    <div className="current-users">
      <div className="current-user-title">
        <h2 className="current-user-header">Current Users</h2>
        <Select
          className="select-current-users"
          labelId="demo-select-small-label"
          id="demo-select-small"
          value={day}
          onChange={handleChange}
        >
          <MenuItem value={30}>30 day</MenuItem>
          <MenuItem value={20}>20 day</MenuItem>
          <MenuItem value={10}>10 day</MenuItem>
        </Select>
      </div>
      <div>
        <img src={icon} alt="" />
      </div>
    </div>
  );
};

export default CurrentUsers;
