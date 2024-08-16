import React from "react";
import "@/App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/components/Auth/Login";
import CategoryMain from "@/components/MaterialCategories/CategoriesMain";
import CheckLogin from "@/CheckLogin";
import BodyUpdate from "@/components/BodyUpdate/BodyUpdate";
import Main from "@/components/MaterialsMain/Main";
import Body from "@/components/Layout/Body";

const App = () => {
  return (
    <div className="app">
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/materials/categories" />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/materials"
            element={
              <CheckLogin>
                <Body />
              </CheckLogin>
            }
          >
            <Route path="categories" element={<CategoryMain />} />
            <Route path="main" element={<Main />} />
            <Route path="*" element={<BodyUpdate />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
