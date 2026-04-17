// PreOrder.jsx
import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import { db } from "../database/firebaseconfig";
import "../styles/ProductCard.css";

const PreOrder = () => {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(
      collection(db, "productos"),
      where("disponibilidad", "==", "PreOrden")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProductos(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="products-container">
      <h1 className="category-title">Pre-Orden 🛒</h1>

      <div className="products-grid">
        {productos.length === 0 ? (
          <div className="no-products-message">
            No hay productos en pre-orden
          </div>
        ) : (
          productos.map((product) => {
            const whatsappLink = `https://wa.me/+50558684557?text=Hola, me gustaría Pre-Ordenar el producto: ${product.nombre}`;

            return (
              <div key={product.id} className="card-product">

                <span className="badge preorden">Pre-orden</span>

                <div className="card-image">
                  <div className="slider">
                    <img
                      src={product.imagenPrincipal}
                      alt={product.nombre}
                    />
                  </div>
                </div>

                <div className="card-body">
                  <h3>{product.nombre}</h3>

                  <div className="price-material">
                    <span className="price">
                      C$ {Number(product.precio).toLocaleString()}
                    </span>

                    {product.tipoMaterial && (
                      <span className="material">
                        {product.tipoMaterial}
                      </span>
                    )}
                  </div>

                  <div className="card-divider"></div>

                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-preorder"
                  >
                    <FaWhatsapp />
                    Pre-Ordenar
                  </a>

                  <button
                    className="btn-vermas"
                    onClick={() => navigate(`/producto/${product.id}`)}
                  >
                    Ver más →
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PreOrder;