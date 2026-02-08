import React from "react";
import { Modal, Button } from "react-bootstrap";

const RemoveAvailability = ({
  showDeleteModal,
  setShowDeleteModal,
  handleDeleteDisponibilidad,
}) => {

  return (
    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Estás seguro de que deseas eliminar esta disponibilidad?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={handleDeleteDisponibilidad}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveAvailability;