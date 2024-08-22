import "@/App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
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
  const location = useLocation();

  return (
    <div>
      <TransitionGroup>
        <CSSTransition key={location.key} classNames="fade" timeout={50}>
          <Routes location={location}>
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
              <Route
                path="categories/:id"
                element={<ModalUpdateCategories />}
              />
              <Route path="main" element={<MaterialMain />} />
              <Route path="main/created" element={<ModalCreateMaterial />} />
              <Route path="main/:id" element={<ModalUpdateMaterial />} />
              <Route path="*" element={<BodyUpdate />} />
            </Route>
          </Routes>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};

export default App;
