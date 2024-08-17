import React from "react";
import Navbar from "@/components/Layout/Navbar";
import Menu from "@/components/Layout/Menu";

const BodyUpdate = () => {
  return (
    <div className="ml-[200px]">
      <Navbar />
      <Menu />
      <img
        className="pt-[30px] w-full object-cover overflow-hidden"
        src="https://www.baovietbank.vn/media/ANH-BANNER/chung/thong-bao-nang-cap-he-thong.jpg"
      />
    </div>
  );
};

export default BodyUpdate;
