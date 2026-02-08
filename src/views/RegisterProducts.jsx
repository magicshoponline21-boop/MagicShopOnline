// src/views/RegisterProducts.jsx
import React, { useState, useEffect } from "react";
import { Container, Button, Row, Col, Alert } from "react-bootstrap";
import { db } from "../database/firebaseconfig";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

import ProductTable from "../components/products/ProductTable";
import AddProduct from "../components/products/AddProduct";
import EditProduct from "../components/products/EditProduct";
import RemoveProduct from "../components/products/RemoveProduct";
import SearchBox from "../components/search/SearchBox";
import CustomPagination from "../components/ordering/Pagination";

import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const RegisterProducts = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [tiposMaterial, setTiposMaterial] = useState([]);
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  // 🔹 Modales
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [productoEditado, setProductoEditado] = useState(null);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  const itemsPerPage = 5;

  // 🔥 Cargar datos
  useEffect(() => {
    const unsubProductos = onSnapshot(collection(db, "productos"), snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setProductos(data);
      setProductosFiltrados(data);
    });

    const unsubCategorias = onSnapshot(collection(db, "categorias"), snap =>
      setCategorias(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );

    const unsubTipos = onSnapshot(collection(db, "tiposMaterial"), snap =>
      setTiposMaterial(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );

    const unsubDisp = onSnapshot(collection(db, "disponibilidades"), snap =>
      setDisponibilidades(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );

    return () => {
      unsubProductos();
      unsubCategorias();
      unsubTipos();
      unsubDisp();
    };
  }, []);

  // 🔍 Búsqueda (SEGURA)
  const handleSearchChange = (e) => {
    const text = e.target.value.toLowerCase();
    setSearchText(text);

    const filtrados = productos.filter(p =>
      (p.nombre || "").toLowerCase().includes(text) ||
      (p.categoria || "").toLowerCase().includes(text) ||
      (p.tipoMaterial || "").toLowerCase().includes(text)
    );

    setProductosFiltrados(filtrados);
    setCurrentPage(1);
  };

  // ➕ AGREGAR PRODUCTO (🔥 CLAVE CORREGIDA)
  const handleAdd = async (producto) => {
    try {
      const categoriaSeleccionada = categorias.find(
        c => c.nombre === producto.categoria
      );

      await addDoc(collection(db, "productos"), {
        ...producto,
        categoriaId: categoriaSeleccionada?.id || "",
        disponible: producto.disponible ?? true,
      });

      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      setError("Error al agregar producto");
    }
  };

  // ✏️ Editar
  const openEditModal = (producto) => {
    setProductoEditado(producto);
    setShowEditModal(true);
  };

  // 🗑️ Eliminar
  const openDeleteModal = (producto) => {
    setProductoAEliminar(producto);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!productoAEliminar) return;
    await deleteDoc(doc(db, "productos", productoAEliminar.id));
    setShowDeleteModal(false);
  };

  // 📋 Copiar
  const handleCopy = (producto) => {
    navigator.clipboard.writeText(
      `Nombre: ${producto.nombre}\nPrecio: C$${producto.precio}`
    );
  };

  // 📄 PDF individual
  const generarPDFDetalleProducto = (producto) => {
    const doc = new jsPDF();
    doc.text(producto.nombre, 20, 20);
    doc.text(`Precio: C$${producto.precio}`, 20, 30);
    doc.save(`${producto.nombre}.pdf`);
  };

  // 📌 Paginación
  const paginatedProductos = productosFiltrados.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Container className="mt-4">
      <h4>Gestión de Productos</h4>
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-3">
        <Col>
          <Button onClick={() => setShowAddModal(true)}>
            Agregar producto
          </Button>
        </Col>
      </Row>

      <SearchBox
        searchText={searchText}
        handleSearchChange={handleSearchChange}
      />

      <ProductTable
        productos={paginatedProductos}
        openEditModal={openEditModal}
        openDeleteModal={openDeleteModal}
        handleCopy={handleCopy}
        generarPDFDetalleProducto={generarPDFDetalleProducto}
      />

      <CustomPagination
        itemsPerPage={itemsPerPage}
        totalItems={productosFiltrados.length}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {/* MODALES */}
      <AddProduct
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        onAdd={handleAdd}
        categorias={categorias}
        tiposMaterial={tiposMaterial}
        disponibilidades={disponibilidades}
      />

      <EditProduct
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        productoEditado={productoEditado}
        categorias={categorias}
        tiposMaterial={tiposMaterial}
        disponibilidades={disponibilidades}
      />

      <RemoveProduct
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        productoAEliminar={productoAEliminar}
        handleDeleteProducto={handleDelete}
      />
    </Container>
  );
};

export default RegisterProducts;
