import React from 'react';
import styles from './ConfirmDialog.module.css';

function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;
  
  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className={styles.actions}>
          <button 
            className={styles.cancelButton} 
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button 
            className={styles.confirmButton} 
            onClick={onConfirm}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
