import React, { useState } from "react";
import "../../styles/Accounts.css";
import { FaRegCopy, FaCheck } from "react-icons/fa";

import BanproLogo from "../../assets/Banpro.png";
import BilleteraLogo from "../../assets/Billetera.png";
import LafiseLogo from "../../assets/lafise.png";

const accountsData = [
  {
    id: 1,
    banco: "Banpro Grupo Promerica",
    tipoEntidad: "BANCO",
    numero: "10020800566074",
    nombreTitular: "Litzy Daleska López Lumbí",
    tipo: "Ahorro",
    moneda: "Córdobas (C$)",
    logo: BanproLogo,
  },
  {
    id: 2,
    banco: "Banpro Grupo Promerica",
    tipoEntidad: "BANCO",
    numero: "10020810132782",
    nombreTitular: "Litzy Daleska López Lumbí",
    tipo: "Ahorro",
    moneda: "Dólares ($)",
    logo: BanproLogo,
  },
  {
    id: 3,
    banco: "Banco Lafise",
    tipoEntidad: "BANCO",
    numero: "137026975",
    nombreTitular: "Litzy Daleska López Lumbí",
    tipo: "Ahorro",
    moneda: "Córdobas (C$)",
    logo: LafiseLogo,
  },
  {
    id: 4,
    banco: "Banco Lafise",
    tipoEntidad: "BANCO",
    numero: "132291386",
    nombreTitular: "Litzy Daleska López Lumbí",
    tipo: "Ahorro",
    moneda: "Dólares ($)",
    logo: LafiseLogo,
  },
  {
    id: 5,
    banco: "Billetera Móvil",
    tipoEntidad: "SERVICIO",
    numero: "58684557",
    nombreTitular: "Litzy Daleska López Lumbí",
    tipo: "Cuenta Móvil",
    moneda: "Córdobas (C$)",
    logo: BilleteraLogo,
  },
];

const Accounts = () => {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (numero, id) => {
    navigator.clipboard.writeText(numero);
    setCopiedId(id);

    setTimeout(() => {
      setCopiedId(null);
    }, 1500);
  };

  return (
    <div className="accounts-container">
      {accountsData.map((account) => (
        <div key={account.id} className="account-card">
          
          {/* HEADER */}
          <div className="account-header">
            <img src={account.logo} alt={account.banco} />
            <div>
              <span className="account-type">{account.tipoEntidad}</span>
              <h3>{account.banco}</h3>
            </div>
          </div>

          {/* NÚMERO */}
          <div className="account-number-section">
            <span className="section-label">
              {account.banco === "Billetera Móvil"
                ? "Número Móvil"
                : "Número de Cuenta"}
            </span>

            <div className="account-number-box">
              <p className="account-number">{account.numero}</p>

              <button
                className={`copy-btn ${
                  copiedId === account.id ? "copied" : ""
                }`}
                onClick={() => handleCopy(account.numero, account.id)}
              >
                {copiedId === account.id ? <FaCheck /> : <FaRegCopy />}
              </button>
            </div>
          </div>

          {/* TITULAR (FUERA DEL BOX) */}
          <div className="account-holder-section">
            <span className="section-label">Nombre del Titular</span>
            <p className="account-titular">{account.nombreTitular}</p>
          </div>

          {/* FOOTER */}
          <div className="account-footer">
            <div>
              <span>Tipo</span>
              <p>{account.tipo}</p>
            </div>
            <div>
              <span>Moneda</span>
              <p>{account.moneda}</p>
            </div>
          </div>

        </div>
      ))}
    </div>
  );
};

export default Accounts;