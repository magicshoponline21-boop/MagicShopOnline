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
import "../styles/ProductView.css";

const ProductsByCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    if (!categoryId) return;

    const ref = doc(db, "categorias", categoryId);

    getDoc(ref).then((snap) => {
      if (snap.exists()) {
        setCategoryName(snap.data().nombre);
      }
    });

    const q = query(
      collection(db, "productos"),
      where("categoriaId", "==", categoryId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
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

/* ============================= */
/*         TARJETA               */
/* ============================= */

const ProductCard = ({ product }) => {
  const images = useMemo(() => {
    let imgs = [];

    if (product.imagenPrincipal) imgs.push(product.imagenPrincipal);
    if (Array.isArray(product.imagenes)) imgs.push(...product.imagenes);

    return [...new Set(imgs)].filter(Boolean);
  }, [product]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [images]);

  if (images.length === 0) return null;

  return (
    <div className="tarjeta-producto">
      <span
        className={`badge-disponibilidad ${
          product.disponible ? "disponible" : "agotado"
        }`}
      >
        {product.disponible ? "Disponible" : "Agotado"}
      </span>

      <div className="image-container">
        <div
          className="slider"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={product.nombre}
              className="product-image"
            />
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button
              className="arrow left"
              onClick={() =>
                setCurrentIndex((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1
                )
              }
            >
              ‹
            </button>

            <button
              className="arrow right"
              onClick={() =>
                setCurrentIndex((prev) =>
                  prev === images.length - 1 ? 0 : prev + 1
                )
              }
            >
              ›
            </button>

            <div className="dots">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${
                    index === currentIndex ? "active" : ""
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="product-info">
        <h3>{product.nombre}</h3>
        <p className="price">C$ {product.precio}</p>
      </div>
    </div>
  );
};