// src/views/ViewAccounts.jsx
import React from "react";
import Accounts from "../components/accounts/Accounts";
import "../styles/Accounts.css";

const ViewAccounts = () => {
  return (
    <div className="view-accounts">
      <h1>
        Nuestras Cuentas <span>Bancarias</span>
      </h1>

      <p className="accounts-description">
        Realiza tu pago a cualquiera de estas cuentas de forma segura.
        Recuerda enviarnos el comprobante por WhatsApp para procesar tu pedido.
      </p>

      <Accounts />
    </div>
  );
};

export default ViewAccounts;