/* eslint-disable react/prop-types */
import { Navigate, useLocation } from "react-router-dom";

const CheckLogin = ({ children }) => {
  const location = useLocation();

  const loginData = localStorage.getItem("token");
  const check = loginData ? JSON.parse(loginData) : null;

  !check
    ? localStorage.setItem("urlSave", location.pathname + location.search)
    : localStorage.removeItem("urlSave");
  return check ? children : <Navigate to={"/login"} />;
};

export default CheckLogin;
