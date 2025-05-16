import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

export default function useInventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getItems();
      setItems(res.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los datos: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = async (item) => {
    setLoading(true);
    try {
      await api.addItem(item);
      await fetchItems();
      return { success: true };
    } catch (err) {
      setError('Error al añadir el ítem: ' + (err.response?.data?.error || err.message));
      return { success: false, error: err.response?.data || err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id, updatedItem) => {
    setLoading(true);
    try {
      await api.updateItem(id, updatedItem);
      await fetchItems();
      return { success: true };
    } catch (err) {
      setError('Error al actualizar el ítem: ' + (err.response?.data?.error || err.message));
      return { success: false, error: err.response?.data || err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    setLoading(true);
    try {
      await api.deleteItem(id);
      await fetchItems();
      return { success: true };
    } catch (err) {
      setError('Error al eliminar el ítem: ' + (err.response?.data?.error || err.message));
      return { success: false, error: err.response?.data || err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    items,
    loading,
    error,
    selected,
    setSelected,
    fetchItems,
    addItem,
    updateItem,
    deleteItem,
    clearError: () => setError(null)
  };
}
