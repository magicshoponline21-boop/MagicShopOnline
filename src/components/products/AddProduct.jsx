import React, { useState, useEffect } from "react";
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
  const [isLoading, setIsLoading] = useState(false);

  // Resetear formulario cuando se cierra el modal
  useEffect(() => {
    if (!showAddModal) {
      setFormData({
        nombre: "",
        precio: "",
        categoria: "",
        tipoMaterial: "",
        disponibilidad: "",
        imagenes: [],
      });
    }
  }, [showAddModal]);

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
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

  const handleSubmit = async () => {
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

    setIsLoading(true);
    try {
      // Convertir TODAS las imágenes a Base64
      const base64Images = await Promise.all(
        formData.imagenes.map(file => fileToBase64(file))
      );

      // Preparar datos listos para Firestore
      const productData = {
        nombre: formData.nombre.trim(),
        precio: Number(formData.precio) || 0,
        categoria: formData.categoria,
        tipoMaterial: formData.tipoMaterial || "",
        disponibilidad: formData.disponibilidad,
        imagenes: base64Images,
        imagenPrincipal: base64Images[0] || ""
      };

      // Llamar a la función del padre con los datos procesados
      await onAdd(productData);

      // Cerrar modal después de éxito
      setShowAddModal(false);
    } catch (error) {
      console.error("Error al procesar imágenes:", error);
      alert("Error al guardar el producto. Por favor, intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowAddModal(false);
    // El reseteo se hace en el useEffect cuando showAddModal cambia
  };

  return (
    <Modal 
      show={showAddModal} 
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Categoría</Form.Label>
            <Form.Select 
              name="categoria" 
              value={formData.categoria} 
              onChange={handleInputChange} 
              required
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
            <div className="d-flex gap-2 mt-2 flex-wrap">
              {formData.imagenes.map((file, idx) => (
                <div key={idx} className="position-relative" style={{ width: '100px' }}>
                  <Image 
                    src={URL.createObjectURL(file)} 
                    thumbnail 
                    style={{ width: '100%', height: 'auto', objectFit: 'cover' }} 
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    className="position-absolute"
                    style={{ top: '2px', right: '2px', padding: '0px 5px' }}
                    onClick={() => handleRemoveImage(idx)}
                    disabled={isLoading}
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
        <Button 
          variant="secondary" 
          onClick={handleClose}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Guardando...' : 'Guardar Producto'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddProduct;