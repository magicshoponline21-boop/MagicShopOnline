import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../database/firebaseconfig";
import "../styles/ProductView.css";

const ProductView = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Cargar solo las categorías
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "categorias"), (snapshot) => {
      const categoriesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoriesData);
    });

    return () => unsubscribe();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/productos/categoria/${categoryId}`);
  };

  return (
    <div className="product-view-container">

      <div className="categories-container">
        {categories.map((category) => (
          <div
            key={category.id}
            className="category-item"
            onClick={() => handleCategoryClick(category.id)}
            role="button"
            tabIndex={0}
            aria-label={`Ver productos de ${category.nombre}`}
          >
            <div className="category-card">
              <img
                src={category.imagen}
                alt={category.nombre}
                className="category-image"
                loading="lazy"
              />
            </div>
            <span className="category-name">{category.nombre}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductView;