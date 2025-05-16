import React from 'react';
import styles from './Pagination.module.css';

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = [];
  
  // Crear array de páginas para mostrar
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  
  // Si no hay páginas o solo hay una, no mostrar paginación
  if (totalPages <= 1) return null;
  
  return (
    <div className={styles.pagination}>
      <button 
        className={styles.pageButton}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        &laquo; Anterior
      </button>
      
      {pages.map(page => (
        <button
          key={page}
          className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      
      <button 
        className={styles.pageButton}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Siguiente &raquo;
      </button>
    </div>
  );
}

export default Pagination;
