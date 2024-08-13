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
    <div className="flex flex-col gap-[10px] h-screen w-[230px] fixed top-[55px] left-0 bg-[#f1f5f9] text-[#64748B] p-[20px_10px] font-[Arial, Helvetica, sans-serif]">
      <div>
        <div
          onClick={() => setIsOpenDash(!isOpenDash)}
          className="p-[15px] flex items-center gap-[5px] hover:bg-[#babfc3] cursor-pointer"
        >
          <AppstoreOutlined className="text-[20px]" />
          <span>Dashboards</span>
          {isOpenDash ? (
            <CaretUpOutlined className="ml-[35px]" />
          ) : (
            <CaretDownOutlined className="ml-[35px]" />
          )}
        </div>
        <div
          className={`flex flex-col gap-[0] px-[30px] transition-all duration-300 ease-out ${
            isOpenDash ? "max-h-[500px] scale-y-100" : "max-h-0 scale-y-0"
          } overflow-hidden`}
        >
          <NavLink
            className={({ isActive }) =>
              `block p-[10px] ${
                isActive
                  ? "text-[#0EA5E9]"
                  : "text-[#758398] hover:bg-[#babfc3] "
              }`
            }
            to="/dashboard/main"
          >
            Main
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `block p-[10px] ${
                isActive
                  ? "text-[#0EA5E9]"
                  : "text-[#758398] hover:bg-[#babfc3] "
              }`
            }
            to="/dashboard/user-insights"
          >
            User Insights
          </NavLink>
        </div>
      </div>
      <div className="flex flex-col gap-[10px]">
        <div
          onClick={() => setIsOpenMat(!isOpenMat)}
          className="p-[15px] flex items-center gap-[5px] hover:bg-[#babfc3] cursor-pointer"
        >
          <InboxOutlined className="text-[20px]" />
          <span>Materials</span>
          {isOpenMat ? (
            <CaretUpOutlined className="ml-[35px]" />
          ) : (
            <CaretDownOutlined className="ml-[35px]" />
          )}
        </div>
        <div
          className={`flex flex-col gap-[0] px-[30px] transition-all duration-300 ease-out ${
            isOpenMat ? "max-h-[500px] scale-y-100" : "max-h-0 scale-y-0"
          } overflow-hidden`}
        >
          <NavLink
            className={({ isActive }) =>
              `block p-[10px] ${
                isActive
                  ? "text-[#0EA5E9]"
                  : "text-[#758398] hover:bg-[#babfc3] "
              }`
            }
            to="/materials/main"
          >
            Main
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `block p-[10px] ${
                isActive
                  ? "text-[#0EA5E9]"
                  : "text-[#758398] hover:bg-[#babfc3] "
              }`
            }
            to="/materials/categories"
          >
            Categories
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Menu;
