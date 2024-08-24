import "@/App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/Pages/Auth/Login";
import CategoryMain from "@/Pages/MaterialCategories/CategoriesMain";
import CheckLogin from "@/CheckLogin";
import BodyUpdate from "@/Pages/BodyUpdate/BodyUpdate";
import Body from "@/Layout/Body";
import ModalCreateCategories from "@/Pages/MaterialCategories/modal/ModalCreateCatrgories";
import ModalUpdateCategories from "@/Pages/MaterialCategories/modal/ModalUpdateCategories";
import ModalCreateMaterial from "@/Pages/MaterialsMain/modal/ModalCreateMaterial";
import ModalUpdateMaterial from "@/Pages/MaterialsMain/modal/ModalUpdateMaterial";
import MaterialMain from "@/Pages/MaterialsMain/MaterialsMain";

const App = () => {
  return (
    <div>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/materials/main" />} />
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
            <Route path="main" element={<MaterialMain />} />
            <Route path="main/created" element={<ModalCreateMaterial />} />
            <Route path="main/:id" element={<ModalUpdateMaterial />} />
            <Route path="*" element={<BodyUpdate />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
