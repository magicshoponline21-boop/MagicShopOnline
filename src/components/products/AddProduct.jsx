import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Image } from "react-bootstrap";

const AddProduct = ({
  showAddModal,
  setShowAddModal,
  onAdd,
  categorias = [],
  tiposMaterial = [],
  disponibilidades = [],
}) => {
  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    precio: "",
    categoria: "",
    tipoMaterial: "",
    disponibilidad: "",
    imagenes: [],
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!showAddModal) {
      setFormData({
        codigo: "",
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
      reader.onerror = reject;
    });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);

    setFormData((prev) => ({
      ...prev,
      imagenes: files,
    }));
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (isLoading) return;

    if (!formData.codigo.trim()) {
      alert("El código es obligatorio");
      return;
    }

    if (!formData.nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      alert("El precio debe ser mayor que 0");
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
      const base64Images = await Promise.all(
        formData.imagenes.map((file) => fileToBase64(file))
      );

      const productData = {
        codigo: formData.codigo.trim(),
        nombre: formData.nombre.trim(),
        precio: Number(formData.precio),
        categoria: formData.categoria,
        tipoMaterial: formData.tipoMaterial || "",
        disponibilidad: formData.disponibilidad,
        imagenes: base64Images,
        imagenPrincipal: base64Images[0] || "",
      };

      await onAdd(productData);

      setShowAddModal(false);
    } catch (error) {
      console.error("Error real al guardar producto:", error);
      alert("No se pudo registrar el producto.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading) return;
    setShowAddModal(false);
  };

  return (
    <Modal
      show={showAddModal}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton={!isLoading}>
        <Modal.Title>Agregar Producto</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Código</Form.Label>
            <Form.Control
              type="text"
              name="codigo"
              value={formData.codigo}
              onChange={handleInputChange}
              placeholder="Código del producto"
              disabled={isLoading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Nombre del producto"
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
              disabled={isLoading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Categoría</Form.Label>
            <Form.Select
              name="categoria"
              value={formData.categoria}
              onChange={handleInputChange}
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

          <Form.Group>
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
                <div
                  key={idx}
                  className="position-relative"
                  style={{ width: "100px" }}
                >
                  <Image
                    src={URL.createObjectURL(file)}
                    thumbnail
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                    }}
                  />

                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    className="position-absolute"
                    style={{
                      top: "2px",
                      right: "2px",
                      padding: "0px 5px",
                    }}
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
          type="button"
          variant="secondary"
          onClick={handleClose}
          disabled={isLoading}
        >
          Cancelar
        </Button>

        <Button
          type="button"
          variant="primary"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Guardando..." : "Guardar Producto"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddProduct;