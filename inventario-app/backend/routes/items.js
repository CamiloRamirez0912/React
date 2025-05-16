const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dataFile = path.join(__dirname, '../data/items.json');

// Funciones de utilidad para leer y escribir datos
const readData = () => {
  try {
    return JSON.parse(fs.readFileSync(dataFile));
  } catch (error) {
    console.error('Error al leer el archivo de datos:', error);
    return [];
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error al escribir en el archivo de datos:', error);
    return false;
  }
};

// Middleware para validar item
const validateItem = (req, res, next) => {
  const { name, quantity, price } = req.body;
  
  const errors = [];
  
  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push('El nombre es requerido y debe ser un texto válido');
  }
  
  if (quantity === undefined || isNaN(quantity) || Number(quantity) < 0) {
    errors.push('La cantidad es requerida y debe ser un número positivo');
  }
  
  if (price === undefined || isNaN(price) || Number(price) < 0) {
    errors.push('El precio es requerido y debe ser un número positivo');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  
  // Convertir a los tipos adecuados
  req.body.quantity = Number(quantity);
  req.body.price = Number(price);
  
  next();
};

// Middleware para verificar si un item existe
const itemExists = (req, res, next) => {
  const items = readData();
  const id = parseInt(req.params.id);
  const index = items.findIndex(item => item.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Item no encontrado' });
  }
  
  req.itemIndex = index;
  req.items = items;
  next();
};

// Obtener todos los ítems
router.get('/', (req, res) => {
  try {
    const items = readData();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los items' });
  }
});

// Obtener un ítem específico
router.get('/:id', itemExists, (req, res) => {
  try {
    const { items, itemIndex } = req;
    res.json(items[itemIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el item' });
  }
});

// Agregar ítem
router.post('/', validateItem, (req, res) => {
  try {
    const items = readData();
    const newItem = { 
      id: Date.now(), 
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    items.push(newItem);
    
    if (writeData(items)) {
      res.status(201).json(newItem);
    } else {
      res.status(500).json({ error: 'Error al guardar el item' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
});

// Editar ítem
router.put('/:id', validateItem, itemExists, (req, res) => {
  try {
    const { items, itemIndex } = req;
    
    // Mantener el id y createdAt originales, actualizar updatedAt
    items[itemIndex] = { 
      ...items[itemIndex], 
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    if (writeData(items)) {
      res.json(items[itemIndex]);
    } else {
      res.status(500).json({ error: 'Error al actualizar el item' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
});

// Actualizar parcialmente un ítem (PATCH)
router.patch('/:id', itemExists, (req, res) => {
  try {
    const { items, itemIndex } = req;
    const { quantity, price } = req.body;
    
    // Validar campos numéricos si están presentes
    if (quantity !== undefined && (isNaN(quantity) || Number(quantity) < 0)) {
      return res.status(400).json({ error: 'La cantidad debe ser un número positivo' });
    }
    
    if (price !== undefined && (isNaN(price) || Number(price) < 0)) {
      return res.status(400).json({ error: 'El precio debe ser un número positivo' });
    }
    
    // Convertir a números si están presentes
    if (quantity !== undefined) req.body.quantity = Number(quantity);
    if (price !== undefined) req.body.price = Number(price);
    
    // Actualizar solo los campos proporcionados
    items[itemIndex] = { 
      ...items[itemIndex], 
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    if (writeData(items)) {
      res.json(items[itemIndex]);
    } else {
      res.status(500).json({ error: 'Error al actualizar el item' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
});

// Eliminar ítem
router.delete('/:id', itemExists, (req, res) => {
  try {
    const { items } = req;
    const id = parseInt(req.params.id);
    
    const filtered = items.filter(item => item.id !== id);
    
    if (writeData(filtered)) {
      res.status(204).end();
    } else {
      res.status(500).json({ error: 'Error al eliminar el item' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
});

module.exports = router;
