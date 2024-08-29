import { Button, Input } from "antd";
import {
  SearchOutlined,
  BellOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import { enqueueSnackbar } from "notistack";

const Navbar = () => {
  const navigate = useNavigate();
  const onClickLogOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
    enqueueSnackbar("Logout successfully", {
      variant: "success",
    });
  };
  return (
    <nav className="flex fixed top-0 left-0 w-full p-3 pt-4 gap-24 bg-white z-10 shadow-md">
      <div className="flex">
        <img className="w-40 h-6 object-cover" src={logo} alt="logo" />
      </div>
      <div className="flex w-full justify-between px-8">
        <Input
          className="w-64 h-7 rounded-full px-2"
          placeholder="Press/to search"
          prefix={<SearchOutlined className="opacity-50" />}
        />
        <div className="flex items-center gap-4">
          <BellOutlined className="text-lg" />
          <div className="flex items-center gap-2">
            <img
              className="w-6 h-6 rounded-full"
              src="https://steamuserimages-a.akamaihd.net/ugc/947328611186947151/F4C4A7A560C12FC3E093F9413D30D82680166314/?imw=1200&impolicy=Letterbox"
              alt="user"
            />
            <p className="text-gray-500 text-sm">Admintractor</p>
            <Button onClick={onClickLogOut} type="primary" danger>
              <LogoutOutlined />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
