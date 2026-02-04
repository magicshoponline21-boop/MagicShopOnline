import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../database/firebaseconfig";
import "../styles/ProductView.css";

const ProductsByCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("Productos");

  // Obtener el nombre de la categoría (opcional pero recomendado)
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "categorias"), (snapshot) => {
      const categoryDoc = snapshot.docs.find((doc) => doc.id === categoryId);
      if (categoryDoc) {
        setCategoryName(categoryDoc.data().nombre || "Productos");
      }
    });
    return () => unsubscribe();
  }, [categoryId]);

  // Cargar productos de la categoría
  useEffect(() => {
    if (!categoryId) return;

    const q = query(
      collection(db, "productos"),
      where("categoriaId", "==", categoryId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
    });

    return () => unsubscribe();
  }, [categoryId]);

  return (
    <div className="products-container">
      <div style={{ display: "flex", alignItems: "center", marginBottom: "30px" }}>
        <button
          onClick={() => navigate("/productos")}
          style={{
            marginRight: "20px",
            padding: "8px 16px",
            background: "#ff6b6b",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          ← Volver a categorías
        </button>
        <h1>{categoryName}</h1>
      </div>

      <div className="products-grid">
        {products.length === 0 ? (
          <p className="no-products-message">
            No hay productos disponibles en esta categoría
          </p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={product.imagen}
                alt={product.nombre}
                className="product-image"
                loading="lazy"
              />
              <div className="product-info">
                <h3>{product.nombre}</h3>
                <p className="price">
                  ${product.precio?.toLocaleString() || product.precio}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductsByCategory;