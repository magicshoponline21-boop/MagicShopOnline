import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Image } from "react-bootstrap";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../database/firebaseconfig";

const EditProduct = ({ showEditModal, setShowEditModal, productoEditado, categorias, tiposMaterial, disponibilidades }) => {
  const [formEditado, setFormEditado] = useState({
    nombre: "",
    precio: "",
    categoria: "",
    tipoMaterial: "",
    disponibilidad: "",
  });
  const [imagenesEdit, setImagenesEdit] = useState([]);

  useEffect(() => {
    if (productoEditado) {
      setFormEditado({
        nombre: productoEditado.nombre,
        precio: productoEditado.precio,
        categoria: productoEditado.categoria,
        tipoMaterial: productoEditado.tipoMaterial,
        disponibilidad: productoEditado.disponibilidad,
      });
      setImagenesEdit(productoEditado.imagenes || []);
    }
  }, [productoEditado]);

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
    const nuevasImagenes = [...imagenesEdit];
    nuevasImagenes.splice(index, 1);
    setImagenesEdit(nuevasImagenes);
  };

  const handleEditProducto = async () => {
    try {
      const productoRef = doc(db, "productos", productoEditado.id);

      const base64Images = await Promise.all(
        imagenesEdit.map(async (img) => (img instanceof File ? await fileToBase64(img) : img))
      );

      await setDoc(productoRef, {
        ...formEditado,
        precio: Number(formEditado.precio) || 0,
        imagenes: base64Images,
        imagenPrincipal: base64Images[0] || "",
      });

      setShowEditModal(false);
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    }
  };

  if (!productoEditado) return null;

  return (
    <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control type="text" name="nombre" value={formEditado.nombre} onChange={handleEditInputChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Precio</Form.Label>
            <Form.Control type="number" name="precio" value={formEditado.precio} onChange={handleEditInputChange} min="0" required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Categoría</Form.Label>
            <Form.Select name="categoria" value={formEditado.categoria} onChange={handleEditInputChange} required>
              <option value="">Seleccione una categoría</option>
              {categorias.map((cat) => (<option key={cat.id} value={cat.nombre}>{cat.nombre}</option>))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tipo de Material</Form.Label>
            <Form.Select name="tipoMaterial" value={formEditado.tipoMaterial} onChange={handleEditInputChange}>
              <option value="">Seleccione un tipo de material</option>
              {tiposMaterial.map((mat) => (<option key={mat.id} value={mat.nombre}>{mat.nombre}</option>))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Disponibilidad</Form.Label>
            <Form.Select name="disponibilidad" value={formEditado.disponibilidad} onChange={handleEditInputChange} required>
              <option value="">Seleccione una disponibilidad</option>
              {disponibilidades.map((disp) => (<option key={disp.id} value={disp.nombre}>{disp.nombre}</option>))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Imágenes (máximo 3)</Form.Label>
            <Form.Control type="file" accept="image/*" multiple onChange={handleFileChange} />
            <div className="d-flex gap-2 mt-2">
              {imagenesEdit.map((img, idx) => (
                <div key={idx} className="position-relative">
                  <Image src={img instanceof File ? URL.createObjectURL(img) : img} width="100" />
                  <Button variant="danger" size="sm" style={{ position: "absolute", top: 0, right: 0 }} onClick={() => handleRemoveImage(idx)}>X</Button>
                </div>
              ))}
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancelar</Button>
        <Button variant="primary" onClick={handleEditProducto}>Actualizar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProduct;
