import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { useLocation, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Body from "./components/MaterialCategories/Body";
import Menu from "./components/Menu";
import CheckLogin from "./CheckLogin";
import BodyUpdate from "./components/BodyUpdate/BodyUpdate";
import Main from "./components/MaterialsMain/Main";

const App = () => {
  const location = useLocation();
  return (
    <div className="app">
      {location.pathname !== "/login" && <Navbar />}
      <div>
        {location.pathname !== "/login" && <Menu />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/materials/categories"
            element={
              <CheckLogin>
                <Body />
              </CheckLogin>
            }
          />
          <Route
            path="/materials/main"
            element={
              <CheckLogin>
                <Main />
              </CheckLogin>
            }
          />
          <Route
            path="*"
            element={
              <CheckLogin>
                <BodyUpdate />
              </CheckLogin>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
