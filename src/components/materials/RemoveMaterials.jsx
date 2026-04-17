// RemoveMaterial.jsx
import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const RemoveMaterial = ({
  showDeleteModal,
  setShowDeleteModal,
  materialAEliminar,
  handleDeleteMaterial,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!materialAEliminar) return;

    setIsLoading(true);

    try {
      await handleDeleteMaterial(materialAEliminar.id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error(error);
      alert("Error al eliminar material");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      show={showDeleteModal}
      onHide={() => setShowDeleteModal(false)}
      backdrop="static"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Eliminar Material</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {materialAEliminar ? (
          <>
            <p className="text-danger fw-bold">
              ¿Deseas eliminar este material?
            </p>

            <div className="bg-light p-3 rounded">
              <strong>{materialAEliminar.nombre}</strong>

              <p className="mb-0 mt-2">
                {materialAEliminar.descripcion || "Sin descripción"}
              </p>
            </div>

            <small className="text-muted">
              Esta acción no se puede deshacer.
            </small>
          </>
        ) : (
          <p>Cargando...</p>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setShowDeleteModal(false)}
          disabled={isLoading}
        >
          Cancelar
        </Button>

        <Button
          variant="danger"
          onClick={handleDelete}
          disabled={isLoading || !materialAEliminar}
        >
          {isLoading ? "Eliminando..." : "Eliminar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveMaterial;