const express = require('express');
const cors = require('cors');
const routes = require('./routes/routes');
//const port = 3000;
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(cors());
app.use('/api', routes);

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  // Gestion de l'arrêt propre du serveur
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  });
}

module.exports = app;
