// src/views/CategoryManagement.jsx
import React, { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { db } from "../database/firebaseconfig";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import "../styles/CategoryManagement.css";

// Importaciones de componentes personalizados
import TableCategories from "../components/categories/CategoryTable.jsx";
import EditCategory from "../components/categories/EditCategory.jsx";
import RemoveCategory from "../components/categories/RemoveCategory.jsx";
import AddCategory from "../components/categories/AddCategory.jsx";
import Pagination from "../components/ordering/Pagination.jsx";

const CategoryManagement = () => {
  // Estados para manejo de datos
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre: "",
    descripcion: "",
    imagen: "" // ✅ Campo imagen añadido
  });
  const [categoriaEditada, setCategoriaEditada] = useState(null);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const itemsPerPage = 5;

  const categoriasCollection = collection(db, "categorias");
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Manejo de conexión offline/online
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setError(null);
    };
    const handleOffline = () => {
      setIsOffline(true);
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Cargar categorías desde Firestore
  const fetchCategorias = () => {
    const stopListening = onSnapshot(
      categoriasCollection,
      (snapshot) => {
        const fetchedCategorias = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setCategorias(fetchedCategorias);
        setError(null);
        console.log("Categorías cargadas desde Firestore:", fetchedCategorias);
      },
      (error) => {
        console.error("Error al escuchar categorías:", error);
        if (!isOffline) {
          setError("Error al cargar las categorías: " + error.message);
        }
      }
    );
    return stopListening;
  };

  useEffect(() => {
    const cleanupListener = fetchCategorias();
    return () => cleanupListener();
  }, []);

  // Calcular categorías paginadas
  const paginatedCategorias = categorias.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Manejador de cambios en inputs del formulario de nueva categoría
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaCategoria((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejador de cambios en inputs del formulario de edición
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setCategoriaEditada((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Agregar nueva categoría
  const handleAddCategoria = async () => {
    if (!nuevaCategoria.nombre || !nuevaCategoria.descripcion) {
      alert("Por favor, completa todos los campos antes de guardar.");
      return;
    }
    if (nuevaCategoria.nombre.length < 3) {
      alert("El nombre debe tener al menos 3 caracteres.");
      return;
    }

    setShowModal(false);
    const tempId = `temp_${Date.now()}`;
    const categoriaConId = { ...nuevaCategoria, id: tempId };

    try {
      setCategorias((prev) => [...prev, categoriaConId]);
      setNuevaCategoria({ nombre: "", descripcion: "", imagen: "" });

      await addDoc(categoriasCollection, nuevaCategoria);

      if (isOffline) {
        alert("Sin conexión: Categoría almacenada localmente. Se sincronizará cuando haya internet.");
      }
    } catch (error) {
      console.error("Error al agregar la categoría:", error);
      setCategorias((prev) => prev.filter((cat) => cat.id !== tempId));
      if (!isOffline) {
        alert("Error al agregar la categoría: " + error.message);
      }
    }
  };

  // Actualizar categoría existente
  const handleEditCategoria = async () => {
    if (!categoriaEditada?.nombre || !categoriaEditada?.descripcion) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    if (categoriaEditada.nombre.length < 3) {
      alert("El nombre debe tener al menos 3 caracteres.");
      return;
    }

    setShowEditModal(false);
    const categoriaRef = doc(db, "categorias", categoriaEditada.id);

    try {
      await updateDoc(categoriaRef, {
        nombre: categoriaEditada.nombre,
        descripcion: categoriaEditada.descripcion,
        imagen: categoriaEditada.imagen 
      });

      if (isOffline) {
        setCategorias((prev) =>
          prev.map((cat) =>
            cat.id === categoriaEditada.id ? { ...categoriaEditada } : cat
          )
        );
        alert("Sin conexión: Categoría actualizada localmente.");
      }
    } catch (error) {
      console.error("Error al actualizar la categoría:", error);
      setCategorias((prev) =>
        prev.map((cat) =>
          cat.id === categoriaEditada.id ? { ...categoriaEditada } : cat
        )
      );
      alert("Error al actualizar la categoría: " + error.message);
    }
  };

  // Eliminar categoría
  const handleDeleteCategoria = async () => {
    if (!categoriaAEliminar) return;

    setShowDeleteModal(false);
    const categoriaRef = doc(db, "categorias", categoriaAEliminar.id);

    try {
      setCategorias((prev) => prev.filter((cat) => cat.id !== categoriaAEliminar.id));

      await deleteDoc(categoriaRef);

      if (isOffline) {
        alert("Sin conexión: Categoría eliminada localmente.");
      }
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
      setCategorias((prev) => [...prev, categoriaAEliminar]);
      if (!isOffline) {
        alert("Error al eliminar la categoría: " + error.message);
      }
    }
  };

  // Abrir modales
  const openEditModal = (categoria) => {
    setCategoriaEditada({
      ...categoria,
      imagen: categoria.imagen || "" 
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (categoria) => {
    setCategoriaAEliminar(categoria);
    setShowDeleteModal(true);
  };

  return (
    <Container className="mt-5">
      <h4 className="gestion-categoria-titulo">Gestión de Categorías</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <Button
        className="mb-3 btn-agregar-categoria"
        onClick={() => setShowModal(true)}
      >
        Agregar Categoría
      </Button>

      <div className="table-responsive">
        <TableCategories
          openEditModal={openEditModal}
          openDeleteModal={openDeleteModal}
          categorias={paginatedCategorias}
        />
      </div>

      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={categorias.length}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <AddCategory
        showModal={showModal}
        setShowModal={setShowModal}
        nuevaCategoria={nuevaCategoria}
        handleInputChange={handleInputChange}
        handleAddCategoria={handleAddCategoria}
      />
      <EditCategory
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        categoriaEditada={categoriaEditada}
        handleEditInputChange={handleEditInputChange}
        handleEditCategoria={handleEditCategoria}
      />
      <RemoveCategory
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        handleDeleteCategoria={handleDeleteCategoria}
      />
    </Container>
  );
};

export default CategoryManagement;