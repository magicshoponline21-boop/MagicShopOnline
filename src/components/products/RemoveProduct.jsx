import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

const RemoveProduct = ({
  showDeleteModal,
  setShowDeleteModal,
  handleDeleteProducto,
  productoAEliminar,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmDelete = async () => {
    if (!handleDeleteProducto || !productoAEliminar) {
      console.error("Datos inválidos para eliminar");
      return;
    }

    setIsLoading(true);
    try {
      // Pasar el ID del producto a la función de eliminación
      await handleDeleteProducto(productoAEliminar.id);
      alert("Producto eliminado exitosamente");
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      alert("Error al eliminar el producto. Por favor, intente nuevamente.");
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleClose = () => {
    setShowDeleteModal(false);
  };

  return (
    <Modal 
      show={showDeleteModal} 
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {productoAEliminar ? (
          <>
            <p className="text-danger fw-bold">
              ¿Estás seguro de que deseas eliminar este producto?
            </p>
            <div className="bg-light p-3 rounded mb-3">
              <strong>{productoAEliminar.nombre}</strong>
              <p className="mb-1">Precio: C$ {productoAEliminar.precio}</p>
              <p className="mb-1">Categoría: {productoAEliminar.categoria}</p>
              {productoAEliminar.imagenPrincipal && (
                <div className="mt-2 text-center">
                  <img 
                    src={productoAEliminar.imagenPrincipal} 
                    alt={productoAEliminar.nombre}
                    style={{ 
                      maxWidth: '150px', 
                      maxHeight: '150px', 
                      objectFit: 'cover', 
                      borderRadius: '8px',
                      border: '2px solid #dee2e6'
                    }} 
                  />
                </div>
              )}
            </div>
            <p className="text-muted small">
              Esta acción no se puede deshacer.
            </p>
          </>
        ) : (
          <p>Cargando información del producto...</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button 
          variant="secondary" 
          onClick={handleClose}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button 
          variant="danger" 
          onClick={handleConfirmDelete}
          disabled={isLoading || !productoAEliminar}
        >
          {isLoading ? 'Eliminando...' : 'Eliminar Producto'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveProduct;