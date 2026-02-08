import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const AddAvailability = ({
  showModal,
  setShowModal,
  nuevaDisponibilidad,
  handleInputChange,
  handleAddDisponibilidad,
}) => {
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Disponibilidad</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={nuevaDisponibilidad.nombre}
              onChange={handleInputChange}
              placeholder="Ingresa el nombre"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleAddDisponibilidad}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddAvailability;