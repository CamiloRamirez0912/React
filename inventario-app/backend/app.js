const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const itemsRouter = require('./routes/items');

const app = express();

// Middleware para CORS y parsing del body
app.use(cors());
app.use(bodyParser.json());

// Middleware para logging
app.use(morgan('dev'));
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Middleware para manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Rutas
app.use('/api/items', itemsRouter);

// Ruta de estado del servidor
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend escuchando en http://localhost:${PORT}`));

module.exports = app;
