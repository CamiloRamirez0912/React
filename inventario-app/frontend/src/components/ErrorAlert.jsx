import React from 'react';
import styles from './ErrorAlert.module.css';

function ErrorAlert({ message, onClose }) {
  if (!message) return null;
  
  return (
    <div className={styles.errorAlert}>
      <div className={styles.errorContent}>
        <p>{message}</p>
        <button className={styles.closeButton} onClick={onClose}>×</button>
      </div>
    </div>
  );
}

export default ErrorAlert;
