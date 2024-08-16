import React from "react";
import Navbar from "./Navbar";
import Menu from "./Menu";
import { Outlet } from "react-router-dom";

const Body = () => {
  return (
    <div>
      <Navbar />
      <Menu />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Body;
