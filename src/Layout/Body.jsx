import Navbar from "@/Layout/Navbar";
import Menu from "@/Layout/Menu";
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
