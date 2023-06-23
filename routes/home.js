const express = require('express');
const router = express.Router();
const path = require('path');
const { readJSONFile } = require('./utils');

const productsFilePath = path.join(__dirname, '../productos.json');

// Ruta GET '/'
router.get('/', (req, res) => {
  const products = readJSONFile(productsFilePath);
  res.render('home', { products });
});

module.exports = router;
