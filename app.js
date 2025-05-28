const express = require('express');
const cors = require('cors');
const routes = require('./routes/routes');
const { runMigration } = require('./config/database');
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
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const startServer = async () => {
  try {
    await runMigration();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Ne démarrer le serveur que si nous ne sommes pas en mode test
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;
