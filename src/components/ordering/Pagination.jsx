// src/components/ordering/Pagination.jsx
import React from "react";
import { Pagination as BSPagination, Row, Col } from "react-bootstrap"; // ← Renombramos la importación

const CustomPagination = ({
  itemsPerPage,
  totalItems,
  currentPage,
  setCurrentPage,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const paginationItems = [];
  const maxPagesToShow = 3;
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let page = startPage; page <= endPage; page++) {
    paginationItems.push(
      <BSPagination.Item
        key={page}
        active={page === currentPage}
        onClick={() => handlePageChange(page)}
      >
        {page}
      </BSPagination.Item>
    );
  }

  return (
    <Row className="mt-3">
      <Col className="d-flex justify-content-center">
        <BSPagination>
          <BSPagination.First
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          />
          <BSPagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {startPage > 1 && <BSPagination.Ellipsis />}
          {paginationItems}
          {endPage < totalPages && <BSPagination.Ellipsis />}
          <BSPagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
          <BSPagination.Last
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          />
        </BSPagination>
      </Col>
    </Row>
  );
};

export default CustomPagination;