// src/views/Home.jsx
import React, { useEffect} from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import '../styles/Home.css';
import whatsappIcon from '../assets/whatsapp.png';
import facebookIcon from '../assets/facebook.png';
import instagramIcon from '../assets/instagram.png';
import aboutUsImg from '../assets/Logo_Variant3.png';

const Home = () => {
  // Función para observar elementos y añadir clase cuando entran en vista
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('cascade-animate');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observar todos los elementos con la clase 'cascade-item'
    const elements = document.querySelectorAll('.cascade-item');
    elements.forEach((el) => observer.observe(el));

    // Limpiar al desmontar
    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <>
      {/* Hero Section - sin animación de scroll */}
      <div className="home-hero">
        <Container>
          <h1 className="hero-title">Bienvenidos a MAGIC SHOP ONLINE</h1>
          <h2 className="hero-subtitle">¡Estilo a tu alcance!</h2>
          <p className="hero-text">
            Compra ropa, accesorios, productos de tus plataformas favoritas y más!
          </p>
          <Button variant="primary" className="hero-btn shake-button">
            Explora nuestra colección
          </Button>
        </Container>
      </div>

      {/* About Section con animación al hacer scroll */}
      <section className="about-section">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="mb-4 mb-md-0">
              <div className="cascade-item" style={{ animationDelay: '100ms' }}>
                <img
                  src={aboutUsImg}
                  alt="Logo Magic Shop Online"
                  className="about-image"
                />
              </div>
            </Col>
            <Col md={6}>
              <div className="cascade-item" style={{ animationDelay: '200ms' }}>
                <h2 className="about-title">Sobre nosotros</h2>
                <p className="about-text">
                  Magic Online Shop ofrece un catálogo digital con ropa, joyería y la posibilidad de realizar pedidos en tus plataformas favoritas como Shein y Amazon, entre otras y preordena productos exclusivos.
                </p>
              </div>
            </Col>
          </Row>

          <Row className="mt-5">
            <Col md={6} className="mb-4">
              <div className="cascade-item" style={{ animationDelay: '300ms' }}>
                <div className="card mission-card p-4">
                  <h3 className="card-title text-pink">Nuestra Misión</h3>
                  <p className="card-text">
                    Ofrecer un catálogo digital intuitivo y un servicio personalizado para compras de moda en general y productos de tus páginas favoritas.
                  </p>
                </div>
              </div>
            </Col>
            <Col md={6} className="mb-4">
              <div className="cascade-item" style={{ animationDelay: '400ms' }}>
                <div className="card vision-card p-4">
                  <h3 className="card-title text-pink">Nuestra Visión</h3>
                  <p className="card-text">
                    Ser un referente de la moda, llegando a más personas y, promoviendo las compras en línea de forma segura de cualquiera de tus productos favoritos.
                  </p>
                </div>
              </div>
            </Col>
          </Row>

          <footer className="about-footer mt-5 pt-4 border-top">
            <Row className="align-items-center">
              <Col xs={12} md={6} className="text-center text-md-start mb-3 mb-md-0">
                <div className="cascade-item" style={{ animationDelay: '500ms' }}>
                  <p className="copyright mb-0">
                    ©2025 MAGIC SHOP ONLINE. Todos los derechos reservados.
                  </p>
                </div>
              </Col>
              <Col xs={12} md={6} className="text-center text-md-end">
                <div className="social-icons d-flex justify-content-center justify-content-md-end gap-3">
                  <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
                    <div className="cascade-item" style={{ animationDelay: '600ms' }}>
                      <img src={whatsappIcon} className="social-icon" alt="WhatsApp" />
                    </div>
                  </a>
                  <a href="https://facebook.com/magicshoponline" target="_blank" rel="noopener noreferrer">
                    <div className="cascade-item" style={{ animationDelay: '700ms' }}>
                      <img src={facebookIcon} className="social-icon" alt="Facebook" />
                    </div>
                  </a>
                  <a href="https://instagram.com/magicshoponline" target="_blank" rel="noopener noreferrer">
                    <div className="cascade-item" style={{ animationDelay: '800ms' }}>
                      <img src={instagramIcon} className="social-icon" alt="Instagram" />
                    </div>
                  </a>
                </div>
              </Col>
            </Row>
          </footer>
        </Container>
      </section>
    </>
  );
};

export default Home;