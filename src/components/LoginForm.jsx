// src/components/LoginForm.jsx
import React, { useState } from "react";
import { Row, Col, Form, Button, Card, Alert, InputGroup } from "react-bootstrap";
import "../styles/LoginForm.css";

const LoginForm = ({ email, password, error, setEmail, setPassword, handleSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Row className="w-100 justify-content-center align-items-center min-vh-100 g-0">
      <Col xs={12} md={6} lg={5} xl={4}>
        <Card className="login-card">
          <Card.Body className="p-4 p-sm-5">
            <div className="text-center mb-4">
              <h2 className="login-title">Magic Shop Online</h2>
              <p className="login-subtitle">Inicia sesión para continuar</p>
            </div>

            {error && <Alert variant="danger" className="login-alert">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="emailUsuario">
                <Form.Label className="login-label">Correo electrónico</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="login-input"
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="contraseñaUsuario">
                <Form.Label className="login-label">Contraseña</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="login-input"
                  />
                  <Button
                    variant="icon"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    className="password-toggle-btn"
                  >
                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </Button>
                </InputGroup>
              </Form.Group>

              <Button type="submit" className="login-btn w-100">
                Iniciar Sesión
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginForm;