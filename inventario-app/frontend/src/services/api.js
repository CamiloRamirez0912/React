import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para manejar errores globalmente
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const getItems = () => apiClient.get('/items');
export const getItem = (id) => apiClient.get(`/items/${id}`);
export const addItem = (item) => apiClient.post('/items', item);
export const updateItem = (id, item) => apiClient.put(`/items/${id}`, item);
export const patchItem = (id, partialItem) => apiClient.patch(`/items/${id}`, partialItem);
export const deleteItem = (id) => apiClient.delete(`/items/${id}`);
export const checkServerHealth = () => apiClient.get('/health');

export default {
  getItems,
  getItem,
  addItem,
  updateItem,
  patchItem,
  deleteItem,
  checkServerHealth
};
