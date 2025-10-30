// src/components/Header.jsx

import React, { useState } from 'react';
import '../styles/Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-logo">
        <img src="/logo.png" alt="Magic Shop Online" className="logo-img" />
        <span className="logo-text">MAGIC SHOP ONLINE</span>
      </div>

      {/* Botón hamburguesa (solo visible en móviles) */}
      <button
        className="hamburger-button"
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {/* Navegación */}
      <nav className={`header-nav ${isMenuOpen ? 'header-nav--open' : ''}`}>
        <ul className="nav-list">
          <li><a href="#" className="nav-link active">Inicio</a></li>
          <li><a href="#" className="nav-link">Productos</a></li>
          <li><a href="#" className="nav-link">Preordena ya</a></li>
          <li><a href="#" className="nav-link">Cuentas</a></li>
          <li><a href="#" className="nav-link">Preguntas frecuentes</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;