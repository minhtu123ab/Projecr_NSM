import React from "react";
import { Navigate } from "react-router-dom";

const CheckLogin = ({ children }) => {
  const loginData = localStorage.getItem("token");
  const check = loginData ? JSON.parse(loginData) : null;
  return check ? children : <Navigate to={"/login"} />;
};

export default CheckLogin;
