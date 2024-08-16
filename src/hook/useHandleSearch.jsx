import { useLocation, useNavigate } from "react-router-dom";

const useHandleSearch = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = (e, value, tableCategoryRef) => {
    e.preventDefault();
    const newQueryParams = new URLSearchParams(location.search);
    if (value) {
      newQueryParams.set("name", value);
    } else {
      newQueryParams.delete("name");
    }
    newQueryParams.set("page", "0");
    navigate({ search: newQueryParams.toString() });

    if (tableCategoryRef.current) {
      tableCategoryRef.current.resetSelection();
    }
  };
  return { handleSubmit };
};

export default useHandleSearch;
