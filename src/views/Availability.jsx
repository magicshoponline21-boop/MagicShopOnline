import React, { useState, useEffect } from "react";
import { Container, Button, Alert } from "react-bootstrap";
import { db } from "../database/firebaseconfig";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

// Importaciones de componentes personalizados
import AvailabilityTable from "../components/availability/AvailabilityTable";
import AddAvailability from "../components/availability/AddAvailability";
import EditAvailability from "../components/availability/EditAvailability";
import RemoveAvailability from "../components/availability/RemoveAvailability";


const Availability = () => {
  // Estados para manejo de datos
  const [disponibles, setDisponibles] = useState([]);
  const [disponiblesFiltradas, setDisponiblesFiltradas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [nuevaDisponibilidad, setNuevaDisponibilidad] = useState({
    nombre: "",
  });
  const [disponibilidadEditada, setDisponibilidadEditada] = useState(null);
  const [disponibilidadAEliminar, setDisponibilidadAEliminar] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const itemsPerPage = 5;

  // Referencia a la colección de disponibilidades en Firestore
  const disponibilidadesCollection = collection(db, "disponibilidades");

  const [isOffline, setIsOffline] = useState(!navigator.onLine);

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

  // Función para obtener todas las disponibilidades de Firestore
  const fetchDisponibilidades = () => {
    const stopListening = onSnapshot(
      disponibilidadesCollection,
      (snapshot) => {
        const fetchedDisponibilidades = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setDisponibles(fetchedDisponibilidades);
        setDisponiblesFiltradas(fetchedDisponibilidades);
        setError(null);
        console.log("Disponibilidades cargadas desde Firestore:", fetchedDisponibilidades);
        if (isOffline) {
          console.log("Offline: Mostrando datos desde la caché local.");
        }
      },
      (error) => {
        console.error("Error al escuchar disponibilidades:", error);
        if (isOffline) {
          console.log("Offline: Mostrando datos desde la caché local.");
        } else {
          setError("Error al cargar las disponibilidades: " + error.message);
        }
      }
    );
    return stopListening;
  };

  // Hook useEffect para carga inicial y escucha de datos
  useEffect(() => {
    const cleanupListener = fetchDisponibilidades();
    return () => cleanupListener();
  }, []);

  // Calcular disponibilidades paginadas
  const paginatedDisponibilidades = disponiblesFiltradas.length
    ? disponiblesFiltradas.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  const handleSearchChange = (e) => {
    const text = e.target.value.toLowerCase();
    setSearchText(text);

    const filtradas = disponibles.filter((disponibilidad) =>
      disponibilidad.nombre.toLowerCase().includes(text)
    );

    setDisponiblesFiltradas(filtradas);
    setCurrentPage(1);
  };

  // Manejador de cambios en inputs del formulario de nueva disponibilidad
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaDisponibilidad((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejador de cambios en inputs del formulario de edición
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setDisponibilidadEditada((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Función para agregar una nueva disponibilidad (CREATE)
  const handleAddDisponibilidad = async () => {
    // Validar campo requerido
    if (!nuevaDisponibilidad.nombre) {
      setError("Por favor, completa el campo nombre antes de guardar.");
      return;
    }

    // Validación adicional: longitud mínima
    if (nuevaDisponibilidad.nombre.length < 3) {
      setError("El nombre de la disponibilidad debe tener al menos 3 caracteres.");
      return;
    }

    // Cerrar modal
    setShowModal(false);

    // Crear ID temporal para offline y objeto de disponibilidad
    const tempId = `temp_${Date.now()}`;
    const disponibilidadConId = { ...nuevaDisponibilidad, id: tempId };

    try {
      // Actualizar estado local para reflejar la nueva disponibilidad
      setDisponibles((prev) => [...prev, disponibilidadConId]);
      setDisponiblesFiltradas((prev) => [...prev, disponibilidadConId]);

      // Limpiar campos del formulario
      setNuevaDisponibilidad({ nombre: "" });

      // Intentar guardar en Firestore
      await addDoc(disponibilidadesCollection, nuevaDisponibilidad);

      // Mensaje según estado de conexión
      if (isOffline) {
        alert("Sin conexión: Disponibilidad almacenada localmente. Se sincronizará cuando haya internet.");
      } else {
        console.log("Disponibilidad agregada exitosamente en la nube.");
      }
    } catch (error) {
      console.error("Error al agregar la disponibilidad:", error);
      if (isOffline) {
        console.log("Offline: Disponibilidad almacenada localmente.");
      } else {
        // Revertir cambios locales si falla en la nube
        setDisponibles((prev) => prev.filter((disp) => disp.id !== tempId));
        setDisponiblesFiltradas((prev) => prev.filter((disp) => disp.id !== tempId));
        setError("Error al agregar la disponibilidad: " + error.message);
      }
    }
  };

  // Función para actualizar una disponibilidad existente (UPDATE)
  const handleEditDisponibilidad = async () => {
    if (!disponibilidadEditada?.nombre) {
      setError("Por favor, completa el campo nombre antes de actualizar.");
      return;
    }

    // Validación adicional: longitud mínima
    if (disponibilidadEditada.nombre.length < 3) {
      setError("El nombre de la disponibilidad debe tener al menos 3 caracteres.");
      return;
    }

    setShowEditModal(false);

    const disponibilidadRef = doc(db, "disponibilidades", disponibilidadEditada.id);

    try {
      // Intentar actualizar en Firestore
      await updateDoc(disponibilidadRef, {
        nombre: disponibilidadEditada.nombre,
      });

      if (isOffline) {
        // Actualizar estado local inmediatamente si no hay conexión
        setDisponibles((prev) =>
          prev.map((disp) =>
            disp.id === disponibilidadEditada.id ? { ...disponibilidadEditada } : disp
          )
        );
        setDisponiblesFiltradas((prev) =>
          prev.map((disp) =>
            disp.id === disponibilidadEditada.id ? { ...disponibilidadEditada } : disp
          )
        );
        alert("Sin conexión: Disponibilidad actualizada localmente. Se sincronizará cuando haya internet.");
      } else {
        console.log("Disponibilidad actualizada exitosamente en la nube.");
      }
    } catch (error) {
      console.error("Error al actualizar la disponibilidad:", error);
      setDisponibles((prev) =>
        prev.map((disp) =>
          disp.id === disponibilidadEditada.id ? { ...disponibilidadEditada } : disp
        )
      );
      setDisponiblesFiltradas((prev) =>
        prev.map((disp) =>
          disp.id === disponibilidadEditada.id ? { ...disponibilidadEditada } : disp
        )
      );
      setError("Ocurrió un error al actualizar la disponibilidad: " + error.message);
    }
  };

  // Función para eliminar una disponibilidad (DELETE)
  const handleDeleteDisponibilidad = async () => {
    if (!disponibilidadAEliminar) return;

    // Cerrar modal
    setShowDeleteModal(false);

    try {
      // Actualizar estado local para reflejar la eliminación
      setDisponibles((prev) => prev.filter((disp) => disp.id !== disponibilidadAEliminar.id));
      setDisponiblesFiltradas((prev) =>
        prev.filter((disp) => disp.id !== disponibilidadAEliminar.id)
      );

      // Intentar eliminar en Firestore
      const disponibilidadRef = doc(db, "disponibilidades", disponibilidadAEliminar.id);
      await deleteDoc(disponibilidadRef);

      // Mensaje según estado de conexión
      if (isOffline) {
        alert("Sin conexión: Disponibilidad eliminada localmente. Se sincronizará cuando haya internet.");
      } else {
        console.log("Disponibilidad eliminada exitosamente en la nube.");
      }
    } catch (error) {
      console.error("Error al eliminar la disponibilidad:", error);
      if (isOffline) {
        console.log("Offline: Eliminación almacenada localmente.");
      } else {
        // Restaurar disponibilidad en estado local si falla en la nube
        setDisponibles((prev) => [...prev, disponibilidadAEliminar]);
        setDisponiblesFiltradas((prev) => [...prev, disponibilidadAEliminar]);
        setError("Error al eliminar la disponibilidad: " + error.message);
      }
    }
  };

  // Función para abrir el modal de edición con datos prellenados
  const openEditModal = (disponibilidad) => {
    setDisponibilidadEditada({ ...disponibilidad });
    setShowEditModal(true);
  };

  // Función para abrir el modal de eliminación
  const openDeleteModal = (disponibilidad) => {
    setDisponibilidadAEliminar(disponibilidad);
    setShowDeleteModal(true);
  };

  // Renderizado del componente
  return (
    <Container className="mt-5">
      <h4 className="gestion-disponibilidad-titulo">Gestión de Disponibilidades</h4>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button className="mb-3" onClick={() => setShowModal(true)}>
        Agregar disponibilidad
      </Button>


      <AvailabilityTable
        disponibilidades={paginatedDisponibilidades}
        openEditModal={openEditModal}
        openDeleteModal={openDeleteModal}
      />

      <AddAvailability
        showModal={showModal}
        setShowModal={setShowModal}
        nuevaDisponibilidad={nuevaDisponibilidad}
        handleInputChange={handleInputChange}
        handleAddDisponibilidad={handleAddDisponibilidad}
      />

      <EditAvailability
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        disponibilidadEditada={disponibilidadEditada}
        handleEditInputChange={handleEditInputChange}
        handleEditDisponibilidad={handleEditDisponibilidad}
      />

      <RemoveAvailability
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        handleDeleteDisponibilidad={handleDeleteDisponibilidad}
      />
    </Container>
  );
};

export default Availability;