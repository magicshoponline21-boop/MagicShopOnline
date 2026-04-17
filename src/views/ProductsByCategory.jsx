import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../database/firebaseconfig";
import ProductCard from "../components/products/ProductCard";
import "../styles/ProductView.css";

const ProductsByCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    if (!categoryId) return;

    // 🔹 Obtener nombre de categoría
    const ref = doc(db, "categorias", categoryId);
    getDoc(ref).then((snap) => {
      if (snap.exists()) {
        setCategoryName(snap.data().nombre);
      }
    });

    // 🔥 Query SOLO por categoría (filtrado después)
    const q = query(
      collection(db, "productos"),
      where("categoriaId", "==", categoryId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        // 🔥 FILTRO CLAVE
        .filter((p) => p.disponibilidad !== "PreOrden");

      setProducts(data);
    });

    return () => unsubscribe();
  }, [categoryId]);

  return (
    <div className="products-container">
      <button className="btn-volver" onClick={() => navigate("/productos")}>
        ← Volver
      </button>

      <h1 className="category-title">{categoryName}</h1>

      <div className="products-grid">
        {products.length === 0 ? (
          <div className="no-products-message">
            No hay productos en esta categoría
          </div>
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};

export default ProductsByCategory;

