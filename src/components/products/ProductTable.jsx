// ProductTable.jsx
import React, { useState } from "react";
import { Table, Button, Image } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../styles/ProductsManagement.css";

const ProductTable = ({
  productos,
  openEditModal,
  openDeleteModal,
}) => {
  const [imageIndexes, setImageIndexes] = useState({});

  const nextImage = (id, total) => {
    setImageIndexes((prev) => ({
      ...prev,
      [id]: ((prev[id] || 0) + 1) % total,
    }));
  };

  const prevImage = (id, total) => {
    setImageIndexes((prev) => ({
      ...prev,
      [id]: ((prev[id] || 0) - 1 + total) % total,
    }));
  };

  const getBadgeClass = (disponibilidad) => {
    switch (disponibilidad) {
      case "Disponible":
        return "disponible";
      case "Agotado":
        return "agotado";
      case "PreOrden":
        return "preorden";
      default:
        return "disponible";
    }
  };

  return (
    <div className="tabla-productos-scroll">
      <Table className="tabla-productos">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Código</th>
            <th>Tipo de Material</th>
            <th>Disponibilidad</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {productos.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-4 text-muted">
                No hay productos para mostrar
              </td>
            </tr>
          ) : (
            productos.map((producto) => {
              const imagenes = producto.imagenes || [];
              const currentIndex = imageIndexes[producto.id] || 0;

              return (
                <tr key={producto.id}>
                  <td className="celda-imagen">
                    {imagenes.length > 0 ? (
                      <div className="image-slider">
                        <button
                          className="slider-btn left"
                          onClick={() =>
                            prevImage(producto.id, imagenes.length)
                          }
                        >
                          <i className="bi bi-chevron-left"></i>
                        </button>

                        <Image
                          src={imagenes[currentIndex]}
                          className="product-image"
                        />

                        <button
                          className="slider-btn right"
                          onClick={() =>
                            nextImage(producto.id, imagenes.length)
                          }
                        >
                          <i className="bi bi-chevron-right"></i>
                        </button>
                      </div>
                    ) : (
                      <span className="text-muted">Sin imagen</span>
                    )}
                  </td>

                  <td>{producto.nombre}</td>

                  <td>C$ {producto.precio}</td>

                  <td>{producto.codigo || "Sin código"}</td>

                  <td>
                    {producto.tipoMaterial ||
                      "Sin tipo de material"}
                  </td>

                  <td>
                    <span
                      className={`badge-tabla ${getBadgeClass(
                        producto.disponibilidad
                      )}`}
                    >
                      {producto.disponibilidad || "Disponible"}
                    </span>
                  </td>

                  <td>
                    <div className="acciones">
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => openEditModal(producto)}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>

                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() =>
                          openDeleteModal(producto)
                        }
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default ProductTable;