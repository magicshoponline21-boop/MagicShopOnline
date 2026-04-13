import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Image } from "react-bootstrap";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../database/firebaseconfig";

const EditProduct = ({
  showEditModal,
  setShowEditModal,
  productoEditado,
  categorias = [],
  tiposMaterial = [],
  disponibilidades = [],
}) => {
  const [formEditado, setFormEditado] = useState({
    nombre: "",
    precio: "",
    categoria: "",
    tipoMaterial: "",
    disponibilidad: "",
  });

  const [imagenesEdit, setImagenesEdit] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (showEditModal && productoEditado) {
      setFormEditado({
        nombre: productoEditado.nombre || "",
        precio: productoEditado.precio?.toString() || "",
        categoria: productoEditado.categoria || "",
        tipoMaterial: productoEditado.tipoMaterial || "",
        disponibilidad: productoEditado.disponibilidad || "",
      });

      if (productoEditado.imagenes && Array.isArray(productoEditado.imagenes)) {
        setImagenesEdit([...productoEditado.imagenes]);
      } else {
        setImagenesEdit([]);
      }
    } else {
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
    const files = Array.from(e.target.files);

    setImagenesEdit((prev) => {
      const disponibles = 3 - prev.length;
      if (disponibles <= 0) return prev;

      return [...prev, ...files.slice(0, disponibles)];
    });

    e.target.value = "";
  };

  const handleRemoveImage = (index) => {
    setImagenesEdit((prev) => {
      const nuevas = [...prev];
      nuevas.splice(index, 1);
      return nuevas;
    });
  };

  const handleEditProducto = async () => {
    if (!productoEditado?.id) {
      alert("Error: No se puede editar este producto");
      return;
    }

    if (!formEditado.nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    if (!formEditado.precio || parseFloat(formEditado.precio) <= 0) {
      alert("El precio debe ser mayor que 0");
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
      alert("Debe haber al menos una imagen");
      return;
    }

    setIsLoading(true);

    try {
      const productoRef = doc(db, "productos", productoEditado.id);

      const categoriaSeleccionada = categorias.find(
        (c) => c.nombre === formEditado.categoria
      );

      const base64Images = await Promise.all(
        imagenesEdit.map(async (img) => {
          if (img instanceof File) {
            return await fileToBase64(img);
          }
          return img;
        })
      );

      await setDoc(
        productoRef,
        {
          nombre: formEditado.nombre.trim(),
          precio: Number(formEditado.precio),
          categoria: formEditado.categoria,
          categoriaId: categoriaSeleccionada?.id || "",
          tipoMaterial: formEditado.tipoMaterial,
          disponibilidad: formEditado.disponibilidad,
          imagenes: base64Images,
          imagenPrincipal: base64Images[0],
        },
        { merge: true }
      );

      alert("Producto actualizado correctamente");
      setShowEditModal(false);
    } catch (error) {
      console.error(error);
      alert("Error al actualizar el producto");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => setShowEditModal(false);

  return (
    <Modal show={showEditModal} onHide={handleClose} backdrop="static">
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
                disabled={isLoading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                name="precio"
                value={formEditado.precio}
                onChange={handleEditInputChange}
                disabled={isLoading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select
                name="categoria"
                value={formEditado.categoria}
                onChange={handleEditInputChange}
                disabled={isLoading}
              >
                <option value="">Seleccione</option>
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
                disabled={isLoading}
              >
                <option value="">Seleccione</option>
                {disponibilidades.map((disp) => (
                  <option key={disp.id} value={disp.nombre}>
                    {disp.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Imágenes</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={handleFileChange}
                disabled={isLoading}
              />

              <div className="d-flex gap-2 mt-2 flex-wrap">
                {imagenesEdit.map((img, idx) => (
                  <div key={idx} style={{ position: "relative" }}>
                    <Image
                      src={
                        typeof img === "string"
                          ? img
                          : URL.createObjectURL(img)
                      }
                      width={80}
                      height={80}
                      style={{ objectFit: "cover" }}
                    />
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleRemoveImage(idx)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </Form.Group>
          </Form>
        ) : (
          <p>Cargando...</p>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancelar
        </Button>
        <Button onClick={handleEditProducto} disabled={isLoading}>
          {isLoading ? "Guardando..." : "Guardar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProduct;