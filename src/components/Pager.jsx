/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { memo, useEffect } from "react";
import { DoubleRightOutlined, DoubleLeftOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "antd";
import env from "@/Env";

const Pager = ({ total, setIdDelete, setCheckAll }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const countPage = Math.ceil(total / env.countOfPage);

  const currentParams = new URLSearchParams(location.search);
  const urlPage = currentParams.get("page") || 0;
  let initialPage = parseInt(urlPage);

  const updateURL = (newPage) => {
    currentParams.set("page", newPage);
    navigate(`?${currentParams.toString()}`);
  };

  const onNext = () => {
    if (initialPage < countPage - 1) {
      const newPage = initialPage + 1;
      setIdDelete([]);
      updateURL(newPage);
      setCheckAll(false);
    }
  };

  const onBack = () => {
    if (initialPage > 0) {
      const newPage = initialPage - 1;
      setIdDelete([]);
      updateURL(newPage);
      setCheckAll(false);
    }
  };

  useEffect(() => {
    if (
      isNaN(initialPage) ||
      initialPage < 0 ||
      (countPage && initialPage > countPage)
    ) {
      initialPage = 0;
      updateURL(initialPage);
    }
  }, [navigate, initialPage, countPage]);

  return (
    <div className="w-full bg-white p-2 flex justify-between">
      <Button
        icon={<DoubleLeftOutlined />}
        onClick={onBack}
        disabled={initialPage === 0}
      >
        Previous
      </Button>
      <span className="font-sans">
        {countPage ? initialPage + 1 : 0} of {countPage}
      </span>
      <Button
        icon={<DoubleRightOutlined />}
        onClick={onNext}
        disabled={initialPage >= countPage - 1}
      >
        Next
      </Button>
    </div>
  );
};

export default memo(Pager);
