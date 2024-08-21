import Navbar from "@/components/Layout/Navbar";
import Menu from "@/components/Layout/Menu";
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
