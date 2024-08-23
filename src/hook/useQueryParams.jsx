import { useLocation } from "react-router-dom";
import { useMemo } from "react";

const useQueryParams = () => {
  const location = useLocation();

  return useMemo(() => {
    const queryParams = new URLSearchParams(location.search);
    return {
      name: queryParams.get("name") || "",
      category: queryParams.get("category") || "",
      delete: queryParams.get("delete") || "",
      page: queryParams.get("page") || "",
    };
  }, [location.search]);
};

export default useQueryParams;
