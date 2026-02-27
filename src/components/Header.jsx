// src/components/Header.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../database/authcontext";
import "../styles/Header.css";
import logoMagic from "../assets/Logo_Magic-SinFondo.png";

const Header = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleNavigate = (path) => {
    navigate(path);
    setIsExpanded(false);
    setIsMobileOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setIsMobileOpen(false);
    navigate("/");
  };

  const primaryLinks = [
    { label: "Inicio", path: "/home" },
    { label: "Productos", path: "/productos" },
    { label: "Registrar Productos", path: "/registerProducts" },
    { label: "Preordena ya", path: "/preordena" },
  ];

  const secondaryLinks = [
    { label: "Cuentas", path: "/accounts" },
    { label: "Preguntas frecuentes", path: "/faq" },
    { label: "Gestión categorías", path: "/category-management" },
    { label: "Disponibilidad", path: "/Availability" },
  ];

  return (
    <header className="header">
      <div className="header-top">
        <div
          className="header-logo"
          onClick={() => handleNavigate("/home")}
        >
          <img src={logoMagic} alt="Magic Shop" className="logo-img" />
          <span className="logo-text">MAGIC SHOP</span>
        </div>

        {/* Desktop */}
        <nav className="desktop-nav">
          <ul className="nav-row">
            {primaryLinks.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => handleNavigate(item.path)}
                  className={`nav-link ${isActive(item.path) ? "active" : ""}`}
                >
                  {item.label}
                </button>
              </li>
            ))}

            <li>
              <button
                className={`expand-button ${isExpanded ? "open" : ""}`}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <span className="arrow-icon"></span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Hamburger */}
        <button
          className={`hamburger-button ${isMobileOpen ? "open" : ""}`}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Segunda fila desktop */}
      <div className={`desktop-extra ${isExpanded ? "open" : ""}`}>
        <ul className="nav-row second-row">
          {secondaryLinks.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => handleNavigate(item.path)}
                className={`nav-link ${isActive(item.path) ? "active" : ""}`}
              >
                {item.label}
              </button>
            </li>
          ))}

          {isLoggedIn && (
            <li>
              <button onClick={handleLogout} className="nav-link out">
                Cerrar Sesión
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* MENÚ MÓVIL */}
      <div className={`mobile-menu ${isMobileOpen ? "open" : ""}`}>
        {[...primaryLinks, ...secondaryLinks].map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavigate(item.path)}
            className={`nav-link ${isActive(item.path) ? "active" : ""}`}
          >
            {item.label}
          </button>
        ))}

        {isLoggedIn && (
          <button onClick={handleLogout} className="nav-link out">
            Cerrar Sesión
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;