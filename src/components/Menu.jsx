import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  AppstoreOutlined,
  InboxOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
} from "@ant-design/icons";

const Menu = () => {
  const [isOpenDash, setIsOpenDash] = useState(true);
  const [isOpenMat, setIsOpenMat] = useState(true);

  return (
    <div className="menu">
      <div className="menu-dash">
        <div onClick={() => setIsOpenDash(!isOpenDash)} className="menu-title">
          <AppstoreOutlined style={{ fontSize: 20 }} />
          Dashboards
          {isOpenDash ? (
            <CaretUpOutlined style={{ marginLeft: 35 }} />
          ) : (
            <CaretDownOutlined style={{ marginLeft: 35 }} />
          )}
        </div>
        <div className={`menu-child ${isOpenDash ? "open" : ""}`}>
          <NavLink className="option-menu" to="/dashboard/main">
            Main
          </NavLink>
          <NavLink className="option-menu" to="/dashboard/user-insights">
            User Insights
          </NavLink>
        </div>
      </div>
      <div className="menu-res">
        <div onClick={() => setIsOpenMat(!isOpenMat)} className="menu-title">
          <InboxOutlined style={{ fontSize: 20 }} />
          Materials
          {isOpenMat ? (
            <CaretUpOutlined style={{ marginLeft: 35 }} />
          ) : (
            <CaretDownOutlined style={{ marginLeft: 35 }} />
          )}
        </div>
        <div className={`menu-child ${isOpenMat ? "open" : ""}`}>
          <NavLink className="option-menu" to="/materials/main">
            Main
          </NavLink>
          <NavLink className="option-menu" to="/materials/categories">
            Categories
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Menu;
