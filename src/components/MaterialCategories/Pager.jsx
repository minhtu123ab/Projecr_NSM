import React, { useState, memo } from "react";
import { DoubleRightOutlined, DoubleLeftOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "antd";
import env from "../../Env";

const Pager = ({ total, setIdDelete, setCheckAll }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const countPage = Math.ceil(total / env.countOfPage);

  const currentParams = new URLSearchParams(location.search);
  const initialPage = Number(currentParams.get("page")) || 0;
  const [page, setPage] = useState(initialPage);

  const updateURL = (newPage) => {
    const newParams = new URLSearchParams(location.search);
    newParams.set("page", newPage);
    navigate(`?${newParams.toString()}`);
  };

  const onNext = () => {
    if (page < countPage - 1) {
      const newPage = page + 1;
      setPage(newPage);
      setIdDelete([]);
      updateURL(newPage);
      setCheckAll(false);
    }
  };

  const onBack = () => {
    if (page > 0) {
      const newPage = page - 1;
      setPage(newPage);
      setIdDelete([]);
      updateURL(newPage);
      setCheckAll(false);
    }
  };

  const handleURLChange = () => {
    const newPage = Number(currentParams.get("page")) || 0;
    if (newPage !== page) {
      setPage(newPage);
    }
  };

  handleURLChange();

  return (
    <div className="w-full bg-white pt-2 pb-2 pl-2 pr-2 flex justify-between">
      <Button
        icon={<DoubleLeftOutlined />}
        onClick={onBack}
        disabled={page === 0}
      >
        Previous
      </Button>
      <span className="font-sans">
        {countPage ? page + 1 : 0} of {countPage}
      </span>
      <Button
        icon={<DoubleRightOutlined />}
        onClick={onNext}
        disabled={page >= countPage - 1}
      >
        Next
      </Button>
    </div>
  );
};

export default memo(Pager);
