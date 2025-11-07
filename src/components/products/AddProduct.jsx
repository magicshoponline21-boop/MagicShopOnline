// src/components/products/AddProduct.jsx
import React, { useState } from "react";
import { Modal, Form, Button, Image } from "react-bootstrap";

const AddProduct = ({ 
  showAddModal, 
  setShowAddModal, 
  onAdd, 
  categorias = [], 
  tiposMaterial = [], 
  disponibilidades = [] 
}) => {
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    categoria: "",
    tipoMaterial: "",
    disponibilidad: "",
    imagenes: [],
  });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setFormData(prev => ({ ...prev, imagenes: files }));
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => {
      const nuevasImagenes = [...prev.imagenes];
      nuevasImagenes.splice(index, 1);
      return { ...prev, imagenes: nuevasImagenes };
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Validación básica
    if (!formData.nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }
    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      alert("El precio debe ser un número mayor que 0");
      return;
    }
    if (!formData.categoria) {
      alert("La categoría es obligatoria");
      return;
    }
    if (!formData.disponibilidad) {
      alert("La disponibilidad es obligatoria");
      return;
    }
    if (formData.imagenes.length === 0) {
      alert("Debes subir al menos una imagen");
      return;
    }

    // Llamar a la función del padre con los datos
    onAdd(formData);
  };

  return (
    <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Nombre del producto"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Precio (C$)</Form.Label>
            <Form.Control
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleInputChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Categoría</Form.Label>
            <Form.Select 
              name="categoria" 
              value={formData.categoria} 
              onChange={handleInputChange} 
              required
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.nombre}>
                  {cat.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tipo de Material</Form.Label>
            <Form.Select 
              name="tipoMaterial" 
              value={formData.tipoMaterial} 
              onChange={handleInputChange}
            >
              <option value="">(Opcional)</option>
              {tiposMaterial.map((mat) => (
                <option key={mat.id} value={mat.nombre}>
                  {mat.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Disponibilidad</Form.Label>
            <Form.Select 
              name="disponibilidad" 
              value={formData.disponibilidad} 
              onChange={handleInputChange} 
              required
            >
              <option value="">Selecciona disponibilidad</option>
              {disponibilidades.map((disp) => (
                <option key={disp.id} value={disp.nombre}>
                  {disp.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Imágenes (máximo 3)</Form.Label>
            <Form.Control 
              type="file" 
              accept="image/*" 
              multiple 
              onChange={handleFileChange} 
            />
            <div className="d-flex gap-2 mt-2 flex-wrap">
              {formData.imagenes.map((file, idx) => (
                <div key={idx} className="position-relative" style={{ width: '100px' }}>
                  <Image 
                    src={URL.createObjectURL(file)} 
                    thumbnail 
                    style={{ width: '100%', height: 'auto' }} 
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    className="position-absolute"
                    style={{ top: '2px', right: '2px', padding: '0px 5px' }}
                    onClick={() => handleRemoveImage(idx)}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowAddModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Guardar Producto
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddProduct;