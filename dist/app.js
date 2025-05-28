"use strict";

var express = require('express');
var cors = require('cors');
var routes = require('./routes/routes');
//const port = 3000;
var port = process.env.PORT || 3000;
var app = express();
app.use(express.json());
app.use(cors());
app.use('/api', routes);

// Gestion des erreurs 404
app.use(function (req, res) {
  res.status(404).json({
    error: 'Route not found'
  });
});

// Gestion des erreurs globales
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something broke!'
  });
});
if (process.env.NODE_ENV !== 'test') {
  var server = app.listen(port, function () {
    console.log("Server is running on port ".concat(port));
  });

  // Gestion de l'arrêt propre du serveur
  process.on('SIGTERM', function () {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(function () {
      console.log('HTTP server closed');
      process.exit(0);
    });
  });
}
module.exports = app;