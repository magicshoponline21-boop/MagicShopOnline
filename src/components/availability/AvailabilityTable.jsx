import React from "react";
import { Table, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const AvailabilityTable = ({ disponibilidades, openEditModal, openDeleteModal }) => {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {disponibilidades.length === 0 ? (
          <tr>
            <td colSpan="2">No hay disponibilidades para mostrar</td>
          </tr>
        ) : (
          disponibilidades.map((disponibilidad) => (
            <tr key={disponibilidad.id}>
              <td>{disponibilidad.nombre}</td>
              <td>
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => openEditModal(disponibilidad)}
                >
                  <i className="bi bi-pencil"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => openDeleteModal(disponibilidad)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
};

export default AvailabilityTable;