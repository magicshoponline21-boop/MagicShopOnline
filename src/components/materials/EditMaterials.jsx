// EditMaterial.jsx
import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const EditMaterial = ({
  showEditModal,
  setShowEditModal,
  materialEditado,
  onEdit,
}) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (showEditModal && materialEditado) {
      setFormData({
        nombre: materialEditado.nombre || "",
        descripcion: materialEditado.descripcion || "",
      });
    }
  }, [showEditModal, materialEditado]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    setIsLoading(true);

    try {
      await onEdit({
        id: materialEditado.id,
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
      });

      setShowEditModal(false);
    } catch (error) {
      console.error(error);
      alert("Error al actualizar material");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      show={showEditModal}
      onHide={() => setShowEditModal(false)}
      backdrop="static"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Editar Material</Modal.Title>
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
            <Form.Label>Descripción</Form.Label>
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
          onClick={() => setShowEditModal(false)}
          disabled={isLoading}
        >
          Cancelar
        </Button>

        <Button
          variant="warning"
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? "Guardando..." : "Guardar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditMaterial;