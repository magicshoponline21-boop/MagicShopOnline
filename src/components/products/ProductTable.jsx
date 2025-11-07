import React from "react";
import { Table, Button, Image } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const ProductTable = ({
  productos,
  openEditModal,
  openDeleteModal,
  handleCopy,
  generarPDFDetalleProducto,
}) => {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Imágenes</th>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Tipo de Material</th>
          <th>Disponibilidad</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {productos.length === 0 ? (
          <tr>
            <td colSpan="6">No hay productos para mostrar</td>
          </tr>
        ) : (
          productos.map((producto) => (
            <tr key={producto.id}>
              <td className="d-flex gap-1">
                {producto.imagenes && producto.imagenes.length > 0 ? (
                  producto.imagenes.slice(0, 3).map((img, idx) => (
                    <Image
                      key={idx}
                      src={img}
                      width="80"
                      height="60"
                      style={{ objectFit: "cover", borderRadius: "4px" }}
                    />
                  ))
                ) : (
                  <span>No hay imagen</span>
                )}
              </td>
              <td>{producto.nombre}</td>
              <td>C$ {producto.precio}</td>
              <td>{producto.tipoMaterial || "Sin tipo de material"}</td>
              <td>{producto.disponibilidad || "Sin disponibilidad"}</td>
              <td>
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => openEditModal(producto)}
                >
                  <i className="bi bi-pencil"></i>
                </Button>
                <Button
                  variant="outline-success"
                  size="sm"
                  className="me-2"
                  onClick={() => generarPDFDetalleProducto(producto)}
                >
                  <i className="bi bi-file-earmark-pdf"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="me-2"
                  onClick={() => openDeleteModal(producto)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
                <Button
                  variant="outline-info"
                  size="sm"
                  onClick={() => handleCopy(producto)}
                >
                  <i className="bi bi-clipboard"></i>
                </Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
};

export default ProductTable;
