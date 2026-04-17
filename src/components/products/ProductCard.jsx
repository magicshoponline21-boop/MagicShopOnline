import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import "../../styles/ProductCard.css";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

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

  const getBadge = () => {
    switch (product.disponibilidad) {
      case "Disponible":
        return { text: "Disponible", className: "badge disponible" };

      case "Agotado":
        return { text: "Agotado", className: "badge agotado" };

      case "PreOrden":
        return { text: "Pre-orden", className: "badge preorden" };

      default:
        return { text: "Sin info", className: "badge" };
    }
  };

  const badge = getBadge();

  /* LÍNEA 1 */
  const whatsappLink1 =
    `https://wa.me/50558684557?text=Hola, me interesa el producto: ${product.nombre}`;

  /* LÍNEA 2 */
  const whatsappLink2 =
    `https://wa.me/+50557811172?text=Hola, me interesa el producto: ${product.nombre}`;

  return (
    <div className="card-product">

      <span className={badge.className}>{badge.text}</span>

      {/* Imagen */}
      <div className="card-image">
        <div
          className="slider"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((img, i) => (
            <img key={i} src={img} alt={product.nombre} />
          ))}
        </div>
      </div>

      {/* Body */}
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

        {product.disponibilidad !== "PreOrden" && (
          <p className="whatsapp-text">
            Pedir vía WhatsApp
          </p>
        )}

        {/* Botones */}
        {product.disponibilidad === "PreOrden" ? (
          /* PREORDEN SOLO USA LÍNEA 1 */
          <a
            href={whatsappLink1}
            target="_blank"
            rel="noreferrer"
            className="btn-preorder"
          >
            <FaWhatsapp />
            Pre-Ordenar
          </a>
        ) : (
          /* PRODUCTOS USA DOS LÍNEAS */
          <div className="btn-group">

            <a
              href={whatsappLink1}
              target="_blank"
              rel="noreferrer"
            >
              <FaWhatsapp />
              Línea 1
            </a>

            <a
              href={whatsappLink2}
              target="_blank"
              rel="noreferrer"
            >
              <FaWhatsapp />
              Línea 2
            </a>

          </div>
        )}

        <button
          className="btn-vermas"
          onClick={() => navigate(`/producto/${product.id}`)}
        >
          Ver más →
        </button>

      </div>
    </div>
  );
};

export default ProductCard;