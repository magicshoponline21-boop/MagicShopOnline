import React, { useState, useRef, useEffect } from "react";
import {
  Table,
  Button,
  Image,
  OverlayTrigger,
  Tooltip,
  Modal
} from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

/* =========================
   TEXTO CON TOOLTIP (SOLO SI SE CORTA)
========================= */
const TruncatedText = ({ text, id }) => {
  const ref = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (el) {
      setIsTruncated(el.scrollHeight > el.clientHeight);
    }
  }, [text]);

  const content = (
    <div ref={ref} className="descripcion-cell d-none d-md-block">
      {text}
    </div>
  );

  return isTruncated ? (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip id={`tooltip-${id}`}>{text}</Tooltip>}
    >
      {content}
    </OverlayTrigger>
  ) : (
    content
  );
};

/* =========================
   TABLA DE CATEGORÍAS
========================= */
const CategoryTable = ({ categorias, openEditModal, openDeleteModal }) => {
  const [showModal, setShowModal] = useState(false);
  const [descripcionModal, setDescripcionModal] = useState("");

  return (
    <>
      <div className="table-responsive">
        <Table className="table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td>
                  {categoria.imagen ? (
                    <Image
                      src={categoria.imagen}
                      alt={categoria.nombre}
                      thumbnail
                    />
                  ) : (
                    "—"
                  )}
                </td>

                <td>{categoria.nombre}</td>

                {/* DESCRIPCIÓN */}
                <td className="descripcion-td">
                  {/* PC */}
                  <TruncatedText
                    text={categoria.descripcion}
                    id={categoria.id}
                  />

                  {/* MÓVIL */}
                  <div className="descripcion-cell d-block d-md-none">
                    {categoria.descripcion}
                  </div>

                  {categoria.descripcion?.length > 60 && (
                    <Button
                      variant="link"
                      size="sm"
                      className="ver-mas-btn d-block d-md-none"
                      onClick={() => {
                        setDescripcionModal(categoria.descripcion);
                        setShowModal(true);
                      }}
                    >
                      Ver más
                    </Button>
                  )}
                </td>

                <td>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={() => openEditModal(categoria)}
                  >
                    <i className="bi bi-pencil" />
                  </Button>

                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => openDeleteModal(categoria)}
                  >
                    <i className="bi bi-trash" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* MODAL DESCRIPCIÓN COMPLETA */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Descripción</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ whiteSpace: "pre-wrap" }}>{descripcionModal}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CategoryTable;
