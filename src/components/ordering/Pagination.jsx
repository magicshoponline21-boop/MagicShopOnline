// src/components/Pagination.jsx
import React from "react";
import { Pagination as BootstrapPagination } from "react-bootstrap";

const Pagination = ({ itemsPerPage, totalItems, currentPage, setCurrentPage }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null; // No mostrar si hay solo una página

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <BootstrapPagination className="justify-content-center mt-3">
      <BootstrapPagination.First
        onClick={() => setCurrentPage(1)}
        disabled={currentPage === 1}
      />
      <BootstrapPagination.Prev
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      />

      {pages.map((page) => (
        <BootstrapPagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </BootstrapPagination.Item>
      ))}

      <BootstrapPagination.Next
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      />
      <BootstrapPagination.Last
        onClick={() => setCurrentPage(totalPages)}
        disabled={currentPage === totalPages}
      />
    </BootstrapPagination>
  );
};

export default Pagination;