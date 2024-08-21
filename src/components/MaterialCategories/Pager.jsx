/* eslint-disable react/prop-types */
import { useState, memo } from "react";
import { DoubleRightOutlined, DoubleLeftOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "antd";
import env from "@/Env";

const Pager = ({ total, setIdDelete, setCheckAll }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const countPage = Math.ceil(total / env.countOfPage);

  const currentParams = new URLSearchParams(location.search);
  const initialPage = Number(currentParams.get("page")) || 0;
  const [page, setPage] = useState(initialPage);
  const newParams = new URLSearchParams(location.search);

  const updateURL = (newPage) => {
    newParams.set("page", newPage);
    navigate(`?${newParams.toString()}`);
  };

  // useEffect(() => {
  //   const checkPage = () => {
  //     if (isNaN(page) || page < 0 || page >= countPage) {
  //       newParams.set("page", 0);
  //       navigate(`?${newParams.toString()}`);
  //       setPage(0);
  //     }
  //   };
  //   checkPage();
  // }, [page]);

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
    <div className="w-full bg-white p-2 flex justify-between">
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
