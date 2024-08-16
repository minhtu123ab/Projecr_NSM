import { useLocation } from "react-router-dom";
import { useMemo } from "react";

const useQueryParams = () => {
  const location = useLocation();

  return useMemo(() => {
    const queryParams = new URLSearchParams(location.search);
    return {
      create: queryParams.get("create_at") || "",
      update: queryParams.get("updated_at") || "",
      name: queryParams.get("name") || "",
      delete: queryParams.get("delete") || "",
      page: queryParams.get("page") || "",
    };
  }, [location.search]);
};

export default useQueryParams;
