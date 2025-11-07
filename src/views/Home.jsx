// src/views/Home.jsx
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import '../styles/Home.css'; // Estilos separados

const Home = () => {
  return (
    <div className="home-hero">
      <Container>
        <Row className="justify-content-center align-items-center text-center">
          <Col md={8} lg={6}>
            <h1 className="hero-title">Bienvenidos a MAGIC SHOP ONLINE</h1>
            <h2 className="hero-subtitle">¡Estilo a tu alcance!</h2>
            <p className="hero-text">
              Compra ropa, accesorios, productos de tus plataformas favoritas y más!
            </p>
            <Button variant="primary" className="hero-btn">
              Explora nuestra colección
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;