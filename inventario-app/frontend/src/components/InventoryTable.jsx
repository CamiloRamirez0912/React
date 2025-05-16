import { useState, useEffect } from 'react';
import styles from './InventoryTable.module.css';
import Pagination from './Pagination';
import ConfirmDialog from './ConfirmDialog';
import { formatCurrency, formatDate } from '../utils/formatters';

function InventoryTable({ 
  items, 
  loading, 
  selected, 
  setSelected, 
  onAdd, 
  onEdit, 
  onDelete 
}) {
  const [form, setForm] = useState({ name: '', quantity: '', description: '', price: '' });
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  
  // Items por página
  const itemsPerPage = 5;
  
  // Filtrar items por término de búsqueda
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Ordenar items
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
  
  // Calcular paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  
  // Resetear a la primera página cuando cambia el término de búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);
  
  // Resetear formulario cuando cambia el item seleccionado
  useEffect(() => {
    if (selected) {
      setForm({
        name: selected.name,
        quantity: selected.quantity.toString(),
        description: selected.description || '',
        price: selected.price.toString()
      });
    } else {
      resetForm();
    }
  }, [selected]);
  
  const resetForm = () => {
    setForm({ name: '', quantity: '', description: '', price: '' });
    setSelected(null);
    setError('');
  };
  
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name.trim() || !form.quantity.trim() || !form.price.trim()) {
      setError('Nombre, cantidad y precio son obligatorios');
      return;
    }

    if (isNaN(form.quantity) || parseInt(form.quantity) < 0) {
      setError('La cantidad debe ser un número positivo');
      return;
    }

    if (isNaN(form.price) || parseFloat(form.price) < 0) {
      setError('El precio debe ser un número positivo');
      return;
    }

    const formattedItem = {
      ...form,
      quantity: parseInt(form.quantity),
      price: parseFloat(form.price)
    };

    try {
      if (selected) {
        await onEdit(selected.id, formattedItem);
      } else {
        await onAdd(formattedItem);
      }
      resetForm();
    } catch (err) {
      setError('Error al guardar: ' + err.message);
    }
  };

  const handleRowClick = (item) => {
    setSelected(item);
  };
  
  const handleDeleteClick = () => {
    setConfirmDelete(true);
  };
  
  const confirmDeleteItem = async () => {
    if (selected) {
      await onDelete(selected.id);
      resetForm();
    }
    setConfirmDelete(false);
  };
  
  const cancelDelete = () => {
    setConfirmDelete(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Buscar items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className={styles.sortableHeader}>
                Nombre {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('quantity')} className={styles.sortableHeader}>
                Cantidad {sortConfig.key === 'quantity' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('price')} className={styles.sortableHeader}>
                Precio {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>Descripción</th>
              <th onClick={() => handleSort('createdAt')} className={styles.sortableHeader}>
                Creado {sortConfig.key === 'createdAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className={styles.loadingCell}>Cargando...</td>
              </tr>
            ) : currentItems.length === 0 ? (
              <tr>
                <td colSpan="5" className={styles.emptyCell}>
                  {searchTerm ? 'No se encontraron resultados' : 'No hay items en el inventario'}
                </td>
              </tr>
            ) : (
              currentItems.map(item => (
                <tr
                  key={item.id}
                  className={selected?.id === item.id ? styles.selectedRow : ''}
                  onClick={() => handleRowClick(item)}
                >
                  <td>{item.name}</td>
                  <td className={styles.numberCell}>{item.quantity}</td>
                  <td className={styles.numberCell}>{formatCurrency(item.price)}</td>
                  <td>{item.description}</td>
                  <td>{formatDate(item.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <div className={styles.formContainer}>
        <h3>{selected ? 'Editar Item' : 'Agregar Nuevo Item'}</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nombre:</label>
            <input
              id="name"
              placeholder="Nombre del producto"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className={styles.formInput}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="quantity">Cantidad:</label>
            <input
              id="quantity"
              type="number"
              placeholder="Cantidad"
              value={form.quantity}
              onChange={e => setForm({ ...form, quantity: e.target.value })}
              className={styles.formInput}
              min="0"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="price">Precio:</label>
            <input
              id="price"
              type="number"
              step="0.01"
              placeholder="Precio"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
              className={styles.formInput}
              min="0"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="description">Descripción:</label>
            <textarea
              id="description"
              placeholder="Descripción (opcional)"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className={styles.formTextarea}
              rows="3"
            />
          </div>
          
          {error && <div className={styles.errorMessage}>{error}</div>}
          
          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton}>
              {selected ? 'Actualizar' : 'Agregar'}
            </button>
            
            {selected && (
              <>
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  className={styles.deleteButton}
                >
                  Eliminar
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className={styles.cancelButton}
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        </form>
      </div>
      
      <ConfirmDialog
        isOpen={confirmDelete}
        title="Confirmar eliminación"
        message={`¿Estás seguro de que deseas eliminar "${selected?.name}"?`}
        onConfirm={confirmDeleteItem}
        onCancel={cancelDelete}
      />
    </div>
  );
}

export default InventoryTable;
