// AddMaterial.jsx
import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const AddMaterial = ({
  showAddModal,
  setShowAddModal,
  onAdd,
}) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!showAddModal) {
      setFormData({
        nombre: "",
        descripcion: "",
      });
    }
  }, [showAddModal]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    setIsLoading(true);

    try {
      await onAdd({
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
      });

      setShowAddModal(false);
    } catch (error) {
      console.error(error);
      alert("Error al guardar material");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      show={showAddModal}
      onHide={() => setShowAddModal(false)}
      backdrop="static"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Agregar Material</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              disabled={isLoading}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Descripción (Opcional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              disabled={isLoading}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setShowAddModal(false)}
          disabled={isLoading}
        >
          Cancelar
        </Button>

        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Guardando..." : "Guardar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddMaterial;