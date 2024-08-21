import "@/App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/components/Auth/Login";
import CategoryMain from "@/components/MaterialCategories/CategoriesMain";
import CheckLogin from "@/CheckLogin";
import BodyUpdate from "@/components/BodyUpdate/BodyUpdate";
import Main from "@/components/MaterialsMain/Main";
import Body from "@/components/Layout/Body";
import ModalCreateCategories from "@/components/MaterialCategories/modal/categories/ModalCreateCatrgories";
import ModalUpdateCategories from "@/components/MaterialCategories/modal/categories/ModalUpdateCategories";

const App = () => {
  return (
    <div>
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
            <Route
              path="categories/created"
              element={<ModalCreateCategories />}
            />
            <Route path="categories/:id" element={<ModalUpdateCategories />} />
            <Route path="main" element={<Main />} />
            <Route path="*" element={<BodyUpdate />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
