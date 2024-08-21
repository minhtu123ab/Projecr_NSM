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
            className="p-4 flex items-center gap-1 hover:bg-[#babfc3] cursor-pointer"
          >
            {menuItem.icon}
            <span>{menuItem.name}</span>
            {menuItem.isOpen ? (
              <CaretUpOutlined className="ml-9" />
            ) : (
              <CaretDownOutlined className="ml-9" />
            )}
          </div>
          <div
            className={`flex flex-col px-8 transition-all duration-300 ease-out ${
              menuItem.isOpen ? "max-h-96 scale-y-100" : "max-h-0 scale-y-0"
            } overflow-hidden`}
          >
            {menuItem.items.map((subItem, subIndex) => (
              <NavLink
                key={subIndex}
                className={({ isActive }) =>
                  `block p-2 ${
                    isActive
                      ? "text-[#0EA5E9]"
                      : "text-[#758398] hover:bg-[#babfc3] "
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
