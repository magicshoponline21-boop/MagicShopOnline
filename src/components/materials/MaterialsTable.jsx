// MaterialTable.jsx
import React from "react";
import { Table, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../styles/MaterialsManagement.css";

const MaterialTable = ({
  materiales,
  openEditModal,
  openDeleteModal,
}) => {
  return (
    <div className="tabla-productos-scroll">
      <Table className="tabla-productos">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {materiales.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center py-4 text-muted">
                No hay materiales registrados
              </td>
            </tr>
          ) : (
            materiales.map((material) => (
              <tr key={material.id}>
                <td>{material.nombre}</td>

                <td>
                  {material.descripcion || "Sin descripción"}
                </td>

                <td>
                  <div className="acciones">
                    <Button
                      variant="outline-warning"
                      size="sm"
                      onClick={() => openEditModal(material)}
                    >
                      <i className="bi bi-pencil"></i>
                    </Button>

                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => openDeleteModal(material)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default MaterialTable;