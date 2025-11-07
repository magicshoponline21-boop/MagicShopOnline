// src/App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./database/authcontext";
import ProtectedRoute from "./components/ProtectedRoute"; 
import Login from './views/Login';
import Header from "./components/Header";
import Home from "./views/Home";
import RegisterProducts from "./views/RegisterProducts";
import './styles/Header.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Componente auxiliar para decidir si mostrar el Header
const Layout = () => {
  const location = useLocation();

  // No mostrar el Header en la página de login
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