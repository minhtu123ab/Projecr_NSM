import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  AppstoreOutlined,
  InboxOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
} from "@ant-design/icons";

const Menu = () => {
  const [menu, setMenu] = useState([
    {
      name: "DashBoards",
      isOpen: true,
      icon: <AppstoreOutlined className="text-xl" />,
      items: [
        {
          name: "Main",
          link: "/",
        },
        {
          name: "User Insights",
          link: "/materials/user",
        },
      ],
    },
    {
      name: "Materials",
      isOpen: true,
      icon: <InboxOutlined className="text-xl" />,
      items: [
        {
          name: "Main",
          link: "/materials/main",
        },
        {
          name: "Categories",
          link: "/materials/categories",
        },
        {
          name: "Suppliers",
          link: "/materials/suppliers",
        },
      ],
    },
  ]);

  const toggleMenu = (index) => {
    setMenu((prevMenu) =>
      prevMenu.map((item, i) =>
        i === index ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  };

  return (
    <div className="flex flex-col gap-2 h-screen w-56 fixed top-14 left-0 bg-[#f1f5f9] text-[#64748B] px-2 py-5 font-[Arial, Helvetica, sans-serif]">
      {menu.map((menuItem, index) => (
        <div key={index}>
          <div
            onClick={() => toggleMenu(index)}
            className="p-4 flex items-center justify-between  gap-1 hover:bg-[#E2E8F0] cursor-pointer transition-colors duration-200 rounded-md"
          >
            <div className="flex items-center gap-2">
              {menuItem.icon}
              <span className="font-semibold">{menuItem.name}</span>
            </div>
            {menuItem.isOpen ? <CaretUpOutlined /> : <CaretDownOutlined />}
          </div>
          <div
            className={`mt-1 flex flex-col px-8 transition-max-height duration-500 ease-in-out ${
              menuItem.isOpen ? "max-h-96 scale-y-100" : "max-h-0 scale-y-0"
            } overflow-hidden`}
          >
            {menuItem.items.map((subItem, subIndex) => (
              <NavLink
                key={subIndex}
                className={({ isActive }) =>
                  `block p-2 rounded-md transition-colors duration-200 ${
                    isActive
                      ? "text-[#0EA5E9] bg-[#E0F7FF]"
                      : "text-[#758398] hover:bg-[#E2E8F0] "
                  }`
                }
                to={subItem.link}
              >
                {subItem.name}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Menu;
