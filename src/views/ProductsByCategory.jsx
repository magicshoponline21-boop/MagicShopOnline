import React, { useEffect, useState } from "react";
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
import "../styles/ProductView.css";

const ProductsByCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  // 🔹 Obtener nombre de la categoría
  useEffect(() => {
    const loadCategory = async () => {
      const ref = doc(db, "categorias", categoryId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setCategoryName(snap.data().nombre);
      }
    };
    if (categoryId) loadCategory();
  }, [categoryId]);

  // 🔹 Obtener productos por categoriaId
  useEffect(() => {
    if (!categoryId) return;

    const q = query(
      collection(db, "productos"),
      where("categoriaId", "==", categoryId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProducts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
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
          <p>No hay productos en esta categoría</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="tarjeta-producto">
              {/* 🔹 Badge disponibilidad */}
              <span
                className={`badge-disponibilidad ${
                  product.disponible ? "disponible" : "agotado"
                }`}
              >
                {product.disponible ? "Disponible" : "Agotado"}
              </span>

              <div className="image-container">
                <img src={product.imagen} alt={product.nombre} />
              </div>

              <div className="product-info">
                <h3>{product.nombre}</h3>
                <p className="price">C$ {product.precio}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductsByCategory;
