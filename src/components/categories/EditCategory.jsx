// ModalEdicionCategoria.jsx
import React from "react";
import { Modal, Form, Button, Image } from "react-bootstrap";

const EditCategory = ({
  showEditModal,
  setShowEditModal,
  categoriaEditada,
  handleEditInputChange,
  handleEditCategoria,
}) => {
  if (!categoriaEditada) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleEditInputChange({
          target: {
            name: 'imagen',
            value: reader.result
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Categoría</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={categoriaEditada.nombre}
              onChange={handleEditInputChange}
              placeholder="Ingresa el nombre"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion"
              value={categoriaEditada.descripcion}
              onChange={handleEditInputChange}
              placeholder="Ingresa la descripción"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Imagen</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {categoriaEditada.imagen && (
              <div className="mt-2">
                <Image 
                  src={categoriaEditada.imagen} 
                  alt="Vista previa" 
                  thumbnail 
                  style={{ maxWidth: '150px', maxHeight: '150px' }}
                />
              </div>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleEditCategoria}>
          Actualizar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditCategory;