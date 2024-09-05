/* eslint-disable react/prop-types */
import { CloseSquareOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

const CleanSearch = ({ setValueName, setValueCategory }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);

  const onClick = () => {
    queryParams.get("name") && queryParams.delete("name");
    queryParams.get("category") && queryParams.delete("category");
    setValueName && setValueName("");
    setValueCategory && setValueCategory("");

    navigate({ search: queryParams.toString() });
  };

  return (
    <CloseSquareOutlined
      onClick={onClick}
      className="cursor-pointer opacity-30 hover:scale-110 hover:opacity-80"
    />
  );
};

export default CleanSearch;
