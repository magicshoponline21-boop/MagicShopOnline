import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const EditAvailability = ({
  showEditModal,
  setShowEditModal,
  disponibilidadEditada,
  handleEditInputChange,
  handleEditDisponibilidad,
}) => {
  if (!disponibilidadEditada) return null;

  return (
    <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Disponibilidad</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={disponibilidadEditada.nombre}
              onChange={handleEditInputChange}
              placeholder="Ingresa el nombre"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleEditDisponibilidad}>
          Actualizar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditAvailability;