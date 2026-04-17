// src/views/Materials.jsx
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

import "../styles/MaterialsManagement.css";

/* COMPONENTES */
import MaterialsTable from "../components/materials/MaterialsTable.jsx";
import AddMaterials from "../components/materials/AddMaterials.jsx";
import EditMaterials from "../components/materials/EditMaterials.jsx";
import RemoveMaterials from "../components/materials/RemoveMaterials.jsx";
import Pagination from "../components/ordering/Pagination.jsx";

const Materials = () => {
  /* ---------------- ESTADOS ---------------- */
  const [materiales, setMateriales] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [materialEditado, setMaterialEditado] = useState(null);
  const [materialAEliminar, setMaterialAEliminar] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const materialesCollection = collection(db, "tiposMaterial");

  /* ---------------- ONLINE / OFFLINE ---------------- */
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

  /* ---------------- CARGAR DATOS ---------------- */
  useEffect(() => {
    const stopListening = onSnapshot(
      materialesCollection,
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setMateriales(data);
        setError(null);
      },
      (err) => {
        console.error(err);

        if (!isOffline) {
          setError("Error al cargar materiales");
        }
      }
    );

    return () => stopListening();
  }, []);

  /* ---------------- PAGINACIÓN ---------------- */
  const materialesPaginados = materiales.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* ---------------- AGREGAR ---------------- */
  const handleAddMaterial = async (data) => {
    if (!data.nombre.trim()) {
      alert("Debes ingresar el nombre");
      return;
    }

    if (data.nombre.trim().length < 2) {
      alert("El nombre es muy corto");
      return;
    }

    try {
      setShowModal(false);

      const docRef = await addDoc(materialesCollection, {
        nombre: data.nombre.trim(),
        descripcion: data.descripcion.trim(),
      });

      await updateDoc(docRef, {
        materialId: docRef.id,
      });
    } catch (error) {
      console.error(error);
      alert("Error al guardar material");
    }
  };

  /* ---------------- EDITAR ---------------- */
  const handleEditMaterial = async (data) => {
    if (!data.nombre.trim()) {
      alert("Debes ingresar el nombre");
      return;
    }

    try {
      setShowEditModal(false);

      const ref = doc(db, "tiposMaterial", data.id);

      await updateDoc(ref, {
        nombre: data.nombre.trim(),
        descripcion: data.descripcion.trim(),
      });
    } catch (error) {
      console.error(error);
      alert("Error al actualizar material");
    }
  };

  /* ---------------- ELIMINAR ---------------- */
  const handleDeleteMaterial = async () => {
    if (!materialAEliminar) return;

    try {
      setShowDeleteModal(false);

      const ref = doc(db, "tiposMaterial", materialAEliminar.id);

      await deleteDoc(ref);
    } catch (error) {
      console.error(error);
      alert("Error al eliminar material");
    }
  };

  /* ---------------- MODALES ---------------- */
  const openEditModal = (material) => {
    setMaterialEditado(material);
    setShowEditModal(true);
  };

  const openDeleteModal = (material) => {
    setMaterialAEliminar(material);
    setShowDeleteModal(true);
  };

  /* ---------------- UI ---------------- */
  return (
    <Container className="mt-5">
      <h4 className="gestion-material-titulo">
        Gestión de Tipos de Materiales
      </h4>

      {error && <div className="alert alert-danger">{error}</div>}

      <Button
        className="mb-3 btn-agregar-material"
        onClick={() => setShowModal(true)}
      >
        Agregar Material
      </Button>

      <div className="table-responsive">
        <MaterialsTable
          materiales={materialesPaginados}
          openEditModal={openEditModal}
          openDeleteModal={openDeleteModal}
        />
      </div>

      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={materiales.length}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {/* MODAL AGREGAR */}
      <AddMaterials
        showAddModal={showModal}
        setShowAddModal={setShowModal}
        onAdd={handleAddMaterial}
      />

      {/* MODAL EDITAR */}
      <EditMaterials
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        materialEditado={materialEditado}
        onEdit={handleEditMaterial}
      />

      {/* MODAL ELIMINAR */}
      <RemoveMaterials
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        materialAEliminar={materialAEliminar}
        handleDeleteMaterial={handleDeleteMaterial}
      />
    </Container>
  );
};

export default Materials;