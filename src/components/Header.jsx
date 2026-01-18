// src/components/Header.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // ← Añadido useLocation
import { useAuth } from '../database/authcontext';
import '../styles/Header.css';
import logoMagic from '../assets/Logo_Magic-SinFondo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // ← Obtiene la ruta actual

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      setIsMenuOpen(false);
      localStorage.removeItem('adminEmail');
      localStorage.removeItem('adminPassword');
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Función para determinar si un enlace está activo
  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div
        className="header-logo"
        onClick={() => handleNavigate('/home')}
        style={{ cursor: 'pointer' }}
      >
        <img src={logoMagic} alt="Magic Shop Online" className="logo-img" />
        <span className="logo-text">MAGIC SHOP ONLINE</span>
      </div>

      <button
        className="hamburger-button"
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      <nav className={`header-nav ${isMenuOpen ? 'header-nav--open' : ''}`}>
        <ul className="nav-list">
          <li>
            <button
              onClick={() => handleNavigate('/home')}
              className={`nav-link ${isActive('/home') ? 'active' : ''}`}
            >
              Inicio
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigate('/productos')}
              className={`nav-link ${isActive('/productos') ? 'active' : ''}`}
            >
              Productos
            </button>
          </li>

          <li>
            <button
              onClick={() => handleNavigate('/registerProducts')}
              className={`nav-link ${isActive('/registerProducts') ? 'active' : ''}`}
            >
              Registrar Productos
            </button>
          </li>

          <li>
            <button
              onClick={() => handleNavigate('/preordena')}
              className={`nav-link ${isActive('/preordena') ? 'active' : ''}`}
            >
              Preordena ya
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigate('/cuentas')}
              className={`nav-link ${isActive('/cuentas') ? 'active' : ''}`}
            >
              Cuentas
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigate('/faq')}
              className={`nav-link ${isActive('/faq') ? 'active' : ''}`}
            >
              Preguntas frecuentes
            </button>
          </li>

          <li>
            <button
              onClick={() => handleNavigate('/category-management')}
              className={`nav-link ${isActive('/category-management') ? 'active' : ''}`}
            >
              Gestión categorías
            </button>
          </li>

          {isLoggedIn ? (
            <li>
              <button onClick={handleLogout} className="nav-link">
                Cerrar Sesión
              </button>
            </li>
          ) : location.pathname !== '/' ? (
            <li>
              <button
                onClick={() => handleNavigate('/')}
                className="nav-link"
              >
                Iniciar Sesión
              </button>
            </li>
          ) : null}
        </ul>
      </nav>
    </header>
  );
};

export default Header;