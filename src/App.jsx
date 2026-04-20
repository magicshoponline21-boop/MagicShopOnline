// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { AuthProvider } from "./database/authcontext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./views/Login";
import Header from "./components/Header";
import Home from "./views/Home";
import RegisterProducts from "./views/RegisterProducts";
import CategoryManagement from "./views/CategoryManagement";
import Products from "./views/Products";
import ProductsByCategory from "./views/ProductsByCategory";
import PreOrder from "./views/PreOrder";
import ViewAccounts from "./views/ViewAccounts";
import Availability from "./views/Availability";
import Materials from "./views/Materials";
import FrequentlyQuestions from "./views/FrequentlyQuestions";

import "./styles/Header.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Layout = () => {
  const location = useLocation();
  const hideHeader = location.pathname === "/";

  return (
    <>
      {!hideHeader && <Header />}

      <main>
        <Routes>
          {/* LOGIN */}
          <Route path="/" element={<Login />} />

          {/* HOME */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* PRODUCTOS */}
          <Route path="/productos" element={<Products />} />
          <Route
            path="/productos/:categoryId"
            element={<ProductsByCategory />}
          />

          {/* GESTIÓN PRODUCTOS */}
          <Route
            path="/registerProducts"
            element={
              <ProtectedRoute>
                <RegisterProducts />
              </ProtectedRoute>
            }
          />

          {/* CATEGORÍAS */}
          <Route
            path="/category-management"
            element={
              <ProtectedRoute>
                <CategoryManagement />
              </ProtectedRoute>
            }
          />

          {/* MATERIALES */}
          <Route
            path="/materials"
            element={
              <ProtectedRoute>
                <Materials />
              </ProtectedRoute>
            }
          />

          {/* DISPONIBILIDAD */}
          <Route
            path="/availability"
            element={
              <ProtectedRoute>
                <Availability />
              </ProtectedRoute>
            }
          />

          {/* CUENTAS */}
          <Route
            path="/accounts"
            element={
              <ProtectedRoute>
                <ViewAccounts />
              </ProtectedRoute>
            }
          />

          {/* PREORDEN */}
          <Route path="/preorden" element={<PreOrder />} />

          {/* PREGUNTAS FRECUENTES */}
          <Route path="/pregunfrecuen" element={<FrequentlyQuestions />} />

          {/* FALLBACK */}
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Layout />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;