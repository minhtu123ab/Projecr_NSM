import React from "react";
import { Button, Input } from "antd";
import {
  SearchOutlined,
  BellOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const onClickLogOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <nav className="navbar">
      <div className="navbar-1">
        <div className="navbar-1-item">
          <div>
            <img className="img-navbar-1" src={logo} />
          </div>
        </div>
      </div>
      <div className="navbar-2">
        <Input
          className="input-navbar"
          placeholder="Press/to search"
          prefix={
            <SearchOutlined
              style={{
                opacity: 0.5,
              }}
            />
          }
        />
        <div className="navbar-2-item">
          <BellOutlined />
          <div className="navbar-2-item-clilden">
            <img
              className="img-navbar-2"
              src="https://s3-alpha-sig.figma.com/img/53ce/8bf2/35d0a957df4101b2d9d0aa8b319caac3?Expires=1724025600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=IOsz0k~H65yLuqEoO0l1oHWw7mEKCnChztcLDpqGNSKCIMiqOvdQSy23npP~-KVzriaPvmP4YoBwnlHXQwHKOS9hZIIYJlN6zIpABKOuoXzIled8tLFTFKPh3JAuRbpL98C1mcJlDPk~x2bB1yo~o0RBrDDEwjYrgb7W0TJXI7nHl9100QPb-zPWGbSVNChMjA7TY-wzT3mPoBsODmqJv2KsqzzFJN7Pi1f6QyPMXNNdq7AWzei2p8~HvLCiGgYDnextKzCLsirqrvXuvjWktLqWAFaiH0JdmTJdGTBAPF-lnnkYji299ITscRi2wPCJHHMxgCBzUCSEmXq1uhh-YA__"
            />
            <p className="navbar-2-title">Admintractor </p>
            <Button onClick={onClickLogOut} danger>
              <LogoutOutlined />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
