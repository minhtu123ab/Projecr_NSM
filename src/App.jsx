import "@/App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/components/Auth/Login";
import CategoryMain from "@/components/MaterialCategories/CategoriesMain";
import CheckLogin from "@/CheckLogin";
import BodyUpdate from "@/components/BodyUpdate/BodyUpdate";
import Body from "@/components/Layout/Body";
import ModalCreateCategories from "@/components/MaterialCategories/modal/ModalCreateCatrgories";
import ModalUpdateCategories from "@/components/MaterialCategories/modal/ModalUpdateCategories";
import ModalCreateMaterial from "./components/MaterialsMain/modal/ModalCreateMaterial";
import ModalUpdateMaterial from "./components/MaterialsMain/modal/ModalUpdateMaterial";
import MaterialMain from "./components/MaterialsMain/MaterialsMain";

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
