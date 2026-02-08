import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Image } from "react-bootstrap";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../database/firebaseconfig";

const EditProduct = ({ showEditModal, setShowEditModal, productoEditado, categorias = [], tiposMaterial = [], disponibilidades = [] }) => {
  const [formEditado, setFormEditado] = useState({
    nombre: "",
    precio: "",
    categoria: "",
    tipoMaterial: "",
    disponibilidad: "",
  });
  const [imagenesEdit, setImagenesEdit] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar datos SOLO cuando hay un producto y el modal está visible
  useEffect(() => {
    if (showEditModal && productoEditado) {
      setFormEditado({
        nombre: productoEditado.nombre || "",
        precio: productoEditado.precio?.toString() || "",
        categoria: productoEditado.categoria || "",
        tipoMaterial: productoEditado.tipoMaterial || "",
        disponibilidad: productoEditado.disponibilidad || "",
      });
      
      // Cargar imágenes existentes
      if (productoEditado.imagenes && Array.isArray(productoEditado.imagenes)) {
        setImagenesEdit([...productoEditado.imagenes]);
      } else {
        setImagenesEdit([]);
      }
    } else {
      // Limpiar formulario cuando se cierra el modal
      setFormEditado({
        nombre: "",
        precio: "",
        categoria: "",
        tipoMaterial: "",
        disponibilidad: "",
      });
      setImagenesEdit([]);
    }
  }, [showEditModal, productoEditado]);

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setFormEditado({ ...formEditado, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setImagenesEdit(files);
  };

  const handleRemoveImage = (index) => {
    setImagenesEdit(prev => {
      const nuevasImagenes = [...prev];
      nuevasImagenes.splice(index, 1);
      return nuevasImagenes;
    });
  };

  const handleEditProducto = async () => {
    if (!productoEditado?.id) {
      alert("Error: No se puede editar este producto");
      return;
    }

    // Validaciones
    if (!formEditado.nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }
    if (!formEditado.precio || parseFloat(formEditado.precio) <= 0) {
      alert("El precio debe ser un número mayor que 0");
      return;
    }
    if (!formEditado.categoria) {
      alert("La categoría es obligatoria");
      return;
    }
    if (!formEditado.disponibilidad) {
      alert("La disponibilidad es obligatoria");
      return;
    }
    if (imagenesEdit.length === 0) {
      alert("Debes tener al menos una imagen");
      return;
    }

    setIsLoading(true);
    try {
      const productoRef = doc(db, "productos", productoEditado.id);

      // Convertir solo los archivos nuevos a Base64
      const base64Images = await Promise.all(
        imagenesEdit.map(async (img) => {
          if (img instanceof File) {
            return await fileToBase64(img);
          }
          return img; // Mantener las imágenes existentes (ya son Base64)
        })
      );

      await setDoc(productoRef, {
        nombre: formEditado.nombre.trim(),
        precio: Number(formEditado.precio),
        categoria: formEditado.categoria,
        tipoMaterial: formEditado.tipoMaterial,
        disponibilidad: formEditado.disponibilidad,
        imagenes: base64Images,
        imagenPrincipal: base64Images[0],
      }, { merge: true }); // Usar merge para no perder otros campos

      alert("Producto actualizado exitosamente");
      setShowEditModal(false);
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      alert("Error al actualizar el producto. Por favor, intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowEditModal(false);
  };

  // NO retornar null aquí - el modal debe renderizarse aunque no haya producto
  // React-Bootstrap manejará la visibilidad con la prop "show"

  return (
    <Modal 
      show={showEditModal} 
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Editar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {productoEditado ? (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control 
                type="text" 
                name="nombre" 
                value={formEditado.nombre} 
                onChange={handleEditInputChange} 
                required 
                disabled={isLoading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Precio (C$)</Form.Label>
              <Form.Control 
                type="number" 
                name="precio" 
                value={formEditado.precio} 
                onChange={handleEditInputChange} 
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
                value={formEditado.categoria} 
                onChange={handleEditInputChange} 
                required
                disabled={isLoading}
              >
                <option value="">Seleccione una categoría</option>
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
                value={formEditado.tipoMaterial} 
                onChange={handleEditInputChange}
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
                value={formEditado.disponibilidad} 
                onChange={handleEditInputChange} 
                required
                disabled={isLoading}
              >
                <option value="">Seleccione una disponibilidad</option>
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
              <small className="text-muted d-block mt-1">
                Selecciona nuevas imágenes para reemplazar las existentes
              </small>
              <div className="d-flex gap-2 mt-2 flex-wrap">
                {imagenesEdit.map((img, idx) => (
                  <div key={idx} className="position-relative" style={{ width: '100px' }}>
                    <Image 
                      src={typeof img === 'string' ? img : URL.createObjectURL(img)} 
                      thumbnail 
                      style={{ width: '100%', height: '80px', objectFit: 'cover' }} 
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
        ) : (
          <p className="text-muted">Cargando datos del producto...</p>
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
          variant="primary" 
          onClick={handleEditProducto}
          disabled={isLoading || !productoEditado}
        >
          {isLoading ? 'Actualizando...' : 'Actualizar Producto'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProduct;