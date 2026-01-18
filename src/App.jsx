// src/App.jsx (CORREGIDO)
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./database/authcontext";
import ProtectedRoute from "./components/ProtectedRoute"; 
import Login from './views/Login';
import Header from "./components/Header";
import Home from "./views/Home";
import RegisterProducts from "./views/RegisterProducts";
import CategoryManagement from "./views/CategoryManagement";
import './styles/Header.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Layout = () => {
  const location = useLocation();
  const hideHeader = location.pathname === '/';

  return (
    <>
      {!hideHeader && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/registerProducts" 
            element={
              <ProtectedRoute>
                <RegisterProducts />
              </ProtectedRoute>
            } 
          />
          {/* ✅ AÑADE ESTA RUTA */}
          <Route 
            path="/category-management" 
            element={
              <ProtectedRoute>
                <CategoryManagement />
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