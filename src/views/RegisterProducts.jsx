// src/views/RegisterProducts.jsx
import React, { useState, useEffect } from "react";
import { Container, Button, Row, Col, Alert } from "react-bootstrap";
import { db } from "../database/firebaseconfig";
import {
  collection,
  addDoc,
  updateDoc,
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

// ✅ IMPORTS CORREGIDOS PARA PDF Y EXCEL
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const RegisterProducts = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [tiposMaterial, setTiposMaterial] = useState([]);
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Estados para modales
  const [showAddModal, setShowAddModal] = useState(false);       // ← NUEVO
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productoEditado, setProductoEditado] = useState(null);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  const itemsPerPage = 5;

  // Cargar datos desde Firestore
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const unsubscribeProductos = onSnapshot(collection(db, "productos"), (snapshot) => {
      const datos = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setProductos(datos);
      setProductosFiltrados(datos);
    }, (err) => setError("Error al cargar productos: " + err.message));

    const unsubscribeCategorias = onSnapshot(collection(db, "categorias"), (snapshot) => {
      setCategorias(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    const unsubscribeTipos = onSnapshot(collection(db, "tiposMaterial"), (snapshot) => {
      setTiposMaterial(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    const unsubscribeDisponibilidades = onSnapshot(collection(db, "disponibilidades"), (snapshot) => {
      setDisponibilidades(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      unsubscribeProductos();
      unsubscribeCategorias();
      unsubscribeTipos();
      unsubscribeDisponibilidades();
    };
  }, []);

  // Productos paginados
  const paginatedProductos = productosFiltrados.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Búsqueda
  const handleSearchChange = (e) => {
    const text = e.target.value.toLowerCase();
    setSearchText(text);
    const filtrados = productos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(text) ||
        p.categoria.toLowerCase().includes(text) ||
        (p.tipoMaterial || "").toLowerCase().includes(text) ||
        p.precio.toString().includes(text) ||
        (p.disponibilidad || "").toLowerCase().includes(text)
    );
    setProductosFiltrados(filtrados);
    setCurrentPage(1);
  };

  // CRUD: funciones que se pasan a los componentes
  const handleAdd = async (nuevoProducto) => {
    try {
      const docRef = await addDoc(collection(db, "productos"), {
        ...nuevoProducto,
        precio: parseFloat(nuevoProducto.precio),
      });
      console.log("Producto agregado con ID:", docRef.id);
      setShowAddModal(false); // ← Cierra el modal tras guardar
    } catch (err) {
      setError("Error al agregar: " + err.message);
      throw err;
    }
  };

  const openEditModal = (producto) => {
    setProductoEditado(producto);
    setShowEditModal(true);
  };

  const openDeleteModal = (producto) => {
    setProductoAEliminar(producto);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!productoAEliminar) return;
    try {
      const productoRef = doc(db, "productos", productoAEliminar.id);
      await deleteDoc(productoRef);
      setShowDeleteModal(false);
    } catch (err) {
      setError("Error al eliminar: " + err.message);
    }
  };

  const handleCopy = (producto) => {
    const text = `Nombre: ${producto.nombre}\nPrecio: C$${producto.precio}\nCategoría: ${producto.categoria}\nTipo: ${producto.tipoMaterial || "—"}\nDisponibilidad: ${producto.disponibilidad || "—"}`;
    navigator.clipboard.writeText(text).catch(console.error);
  };

  const generarPDFProductos = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text("Lista de Productos", 105, 20, { align: "center" });

      const columns = ["#", "Nombre", "Precio (C$)", "Categoría", "Material", "Disponibilidad"];
      const rows = productosFiltrados.map((p, i) => [
        i + 1,
        p.nombre,
        p.precio,
        p.categoria,
        p.tipoMaterial || "—",
        p.disponibilidad || "—",
      ]);

      doc.autoTable({
        startY: 30,
        head: [columns],
        body: rows,
        theme: "grid",
        styles: { fontSize: 10 },
        headStyles: { fillColor: [233, 78, 119] },
      });

      const fecha = new Date().toISOString().slice(0, 10);
      doc.save(`productos_${fecha}.pdf`);
    } catch (err) {
      console.error("Error al generar PDF:", err);
      setError("No se pudo generar el PDF: " + err.message);
    }
  };

  const exportarExcelProductos = () => {
    try {
      const data = productosFiltrados.map((p, i) => ({
        "#": i + 1,
        "Nombre": p.nombre,
        "Precio (C$)": p.precio,
        "Categoría": p.categoria,
        "Tipo de Material": p.tipoMaterial || "—",
        "Disponibilidad": p.disponibilidad || "—",
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Productos");
      const fecha = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(wb, `productos_${fecha}.xlsx`);
    } catch (err) {
      console.error("Error al exportar Excel:", err);
      setError("No se pudo generar el archivo Excel: " + err.message);
    }
  };

  const generarPDFDetalleProducto = (producto) => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text(`Producto: ${producto.nombre}`, 105, 20, { align: "center" });

      let y = 40;
      doc.setFontSize(12);
      doc.text(`Precio: C$${producto.precio}`, 20, y); y += 10;
      doc.text(`Categoría: ${producto.categoria}`, 20, y); y += 10;
      doc.text(`Tipo de Material: ${producto.tipoMaterial || "No especificado"}`, 20, y); y += 10;
      doc.text(`Disponibilidad: ${producto.disponibilidad || "No especificado"}`, 20, y);

      doc.save(`${producto.nombre.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("Error al generar PDF del producto:", err);
      setError("No se pudo generar el PDF del producto.");
    }
  };

  return (
    <Container className="mt-5">
      <h4 className="gestion-producto-titulo">Gestión de Productos</h4>
      {error && <Alert variant="danger">{error}</Alert>}

      {/* ✅ BOTONES SUPERIORES */}
      <Row className="mb-3 g-2">
        <Col xs={12} md={4}>
          <Button
            variant="primary"
            className="w-100"
            onClick={() => setShowAddModal(true)}
          >
            Agregar producto
          </Button>
        </Col>
        <Col xs={12} md={4}>
          <Button variant="secondary" onClick={generarPDFProductos} className="w-100">
            Generar PDF
          </Button>
        </Col>
        <Col xs={12} md={4}>
          <Button variant="secondary" onClick={exportarExcelProductos} className="w-100">
            Generar Excel
          </Button>
        </Col>
      </Row>

      <SearchBox searchText={searchText} handleSearchChange={handleSearchChange} />

      <ProductTable
        productos={paginatedProductos}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
        onCopy={handleCopy}
        onGeneratePDF={generarPDFDetalleProducto}
        onError={setError}
      />

      <CustomPagination
        itemsPerPage={itemsPerPage}
        totalItems={productosFiltrados.length}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {/* ✅ MODALES */}
      <AddProduct
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        onAdd={handleAdd}
        categorias={categorias}
        tiposMaterial={tiposMaterial}
        disponibilidades={disponibilidades}
        onError={setError}
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
        handleDeleteProducto={handleDelete}
      />
    </Container>
  );
};

export default RegisterProducts;