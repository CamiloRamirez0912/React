import { useState } from 'react';
import InventoryTable from './components/InventoryTable';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorAlert from './components/ErrorAlert';
import useInventory from './hooks/useInventory';
import styles from './App.module.css';

function App() {
  const [isServerChecking, setIsServerChecking] = useState(false);
  const {
    items,
    loading,
    error,
    selected,
    setSelected,
    addItem,
    updateItem,
    deleteItem,
    clearError
  } = useInventory();

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>Sistema de Inventario</h1>
        <p>Gestiona tus productos de manera eficiente</p>
      </header>

      <main className={styles.main}>
        <ErrorAlert message={error} onClose={clearError} />
        
        {loading && isServerChecking ? (
          <div className={styles.loadingContainer}>
            <LoadingSpinner />
            <p>Conectando con el servidor...</p>
          </div>
        ) : (
          <InventoryTable
            items={items}
            loading={loading}
            selected={selected}
            setSelected={setSelected}
            onAdd={addItem}
            onEdit={updateItem}
            onDelete={deleteItem}
          />
        )}
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Sistema de Inventario</p>
      </footer>
    </div>
  );
}

export default App;
