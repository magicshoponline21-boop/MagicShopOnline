import React from "react";
import { InputGroup, Form } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import InputGroupText from "react-bootstrap/esm/InputGroupText";

const SearchBox = ({ searchText, handleSearchChange }) => {
  return (
      <InputGroup className="mb-3 cuadro-busqueda">
        <InputGroupText>
          <i className="bi bi-search"></i>
        </InputGroupText>
        <Form.Control
          type="text"
          placeholder="Buscar..."
          value={searchText}
          onChange={handleSearchChange}
        />
      </InputGroup>

  );
};

export default SearchBox;
