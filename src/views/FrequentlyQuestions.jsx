import React, { useState } from "react";
import "../styles/FrequentlyQuestions.css";

const FrequentlyQuestions = () => {
  const [openQuestion, setOpenQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const faqs = [
    {
      question: "¿Qué productos venden en Magic Shop?",
      answer:
        "Ofrecemos ropa, calzado, accesorios, body mist, perfumes, carteras y otros artículos de moda seleccionados con estilo y calidad.",
    },
    {
      question: "¿Cómo puedo hacer un pedido?",
      answer:
        "Puedes escribirnos por WhatsApp o redes sociales, enviarnos captura del producto y te ayudamos con el proceso.",
    },
    {
      question: "¿Qué métodos de pago aceptan?",
      answer:
        "Aceptamos efectivo, transferencias y depósitos (Lafise, Banpro).",
    },
    {
      question: "¿Hacen envíos?",
      answer:
        "Sí, realizamos envíos a nivel nacional. El costo y tiempo de entrega varían según la ubicación.",
    },
    {
      question: "¿Puedo apartar productos?",
      answer:
        "Sí, puedes reservar tus productos con un adelanto del 30%, aceptando previamente los términos y condiciones.",
    },
    {
      question: "¿Cuánto es el tiempo limitado de una reserva?",
      answer:
        "30 días es el plazo para completar el pago, de lo contrario el artículo vuelve a estar a la venta (no se reembolsa el adelanto).",
    },
    {
      question: "¿Cuánto tarda un pedido en preorden?",
      answer:
        "El tiempo de entrega depende del tipo de envío seleccionado: Envío aéreo: aproximadamente 15 días hábiles. Envío marítimo: aproximadamente 30 días hábiles.",
    },
    {
      question: "¿Tienen promociones o descuentos?",
      answer:
        "Sí, constantemente tenemos ofertas. Síguenos en redes para no perderte ninguna.",
    },
  ];

  const toggleFaq = (question) => {
    setOpenQuestion((currentQuestion) =>
      currentQuestion === question ? null : question
    );
  };

  const normalizeText = (value) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const filteredFaqs = faqs.filter((faq) => {
    const normalizedSearch = normalizeText(searchTerm.trim());

    if (!normalizedSearch) {
      return true;
    }

    return normalizeText(faq.question).includes(normalizedSearch);
  });

  return (
    <div className="frequently-container">
      <h1 className="category-title">Preguntas Frecuentes</h1>

      <div className="search-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Busca una pregunta..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      <div className="faq-list">
        {filteredFaqs.length === 0 ? (
          <div className="faq-empty-state">
            No se encontraron preguntas con ese texto.
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openQuestion === faq.question;

            return (
              <div key={faq.question} className={`faq-item ${isOpen ? "open" : ""}`}>
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => toggleFaq(faq.question)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <span className="faq-arrow">▾</span>
                </button>

                {isOpen && <p className="faq-answer">{faq.answer}</p>}
              </div>
            );
          })
        )}
      </div>

      <div className="help-section">
        <div className="help-text">
          <strong>¿No encuentras lo que buscas?</strong>
          <p>Nuestro equipo está listo para ayudarte con cualquier otra duda que tengas.</p>
        </div>
        <button className="contact-btn">
          Contactar por WhatsApp
        </button>
      </div>
    </div>
  );
};

export default FrequentlyQuestions;