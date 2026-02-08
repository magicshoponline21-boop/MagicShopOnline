import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../database/firebaseconfig";
import "../styles/ProductView.css";

const ProductView = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "categorias"), (snapshot) => {
      setCategories(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="product-view-container">
      <div className="categories-container">
        {categories.map((category) => (
          <div
            key={category.id}
            className="category-item"
            onClick={() => navigate(`/productos/categoria/${category.id}`)}
          >
            <div className="category-card">
              <img
                src={category.imagen}
                alt={category.nombre}
                className="category-image"
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
