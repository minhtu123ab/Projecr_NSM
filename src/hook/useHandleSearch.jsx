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
  const handleSubmitMaterial = (
    e,
    valueMaterial,
    valueCategory,
    tableMaterialRef
  ) => {
    e.preventDefault();
    const newQueryParams = new URLSearchParams(location.search);
    if (valueMaterial && valueCategory) {
      newQueryParams.set("name", valueMaterial);
      newQueryParams.set("category", valueCategory);
    } else if (valueMaterial && !valueCategory) {
      newQueryParams.set("name", valueMaterial);
      newQueryParams.delete("category");
    } else if (valueCategory && !valueMaterial) {
      newQueryParams.set("category", valueCategory);
      newQueryParams.delete("name");
    } else {
      newQueryParams.delete("category");
      newQueryParams.delete("name");
    }
    newQueryParams.set("page", "0");
    navigate({ search: newQueryParams.toString() });
    if (tableMaterialRef.current) {
      tableMaterialRef.current.resetSelection();
    }
  };
  return { handleSubmit, handleSubmitMaterial };
};

export default useHandleSearch;
