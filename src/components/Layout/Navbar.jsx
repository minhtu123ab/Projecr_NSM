import React from "react";
import { Button, Input } from "antd";
import {
  SearchOutlined,
  BellOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const onClickLogOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
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
              src="https://s3-alpha-sig.figma.com/img/53ce/8bf2/35d0a957df4101b2d9d0aa8b319caac3?Expires=1724025600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=IOsz0k~H65yLuqEoO0l1oHWw7mEKCnChztcLDpqGNSKCIMiqOvdQSy23npP~-KVzriaPvmP4YoBwnlHXQwHKOS9hZIIYJlN6zIpABKOuoXzIled8tLFTFKPh3JAuRbpL98C1mcJlDPk~x2bB1yo~o0RBrDDEwjYrgb7W0TJXI7nHl9100QPb-zPWGbSVNChMjA7TY-wzT3mPoBsODmqJv2KsqzzFJN7Pi1f6QyPMXNNdq7AWzei2p8~HvLCiGgYDnextKzCLsirqrvXuvjWktLqWAFaiH0JdmTJdGTBAPF-lnnkYji299ITscRi2wPCJHHMxgCBzUCSEmXq1uhh-YA__"
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
