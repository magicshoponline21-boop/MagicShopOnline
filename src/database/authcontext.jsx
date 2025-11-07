// src/database/authcontext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { appfirebase } from "./firebaseconfig";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // ← Nuevo: estado de carga

  // Escuchar cambios de autenticación
  useEffect(() => {
    const auth = getAuth(appfirebase);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoggedIn(!!currentUser);
      setLoading(false); // ← Importante: termina la carga
    });

    return () => unsubscribe();
  }, []);

  // Eventos de conexión (opcional: mejor sin alert)
  useEffect(() => {
    const handleOnline = () => console.log("Conexión restablecida");
    const handleOffline = () => console.log("Estás offline");

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const logout = async () => {
    const auth = getAuth(appfirebase);
    await signOut(auth);
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, logout, loading }}>
      {!loading && children} {/* ← Solo renderiza cuando Firebase haya respondido */}
    </AuthContext.Provider>
  );
};

export default AuthProvider;