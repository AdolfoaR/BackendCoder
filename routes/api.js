const express = require('express');
const router = express.Router();
const path = require('path');
const { readJSONFile, writeJSONFile } = require('./utils');

const productsFilePath = path.join(__dirname, '../productos.json');

// Ruta GET 
router.get('/products', (req, res) => {
  const products = readJSONFile(productsFilePath);
  res.json(products);
});

// Ruta GET 
router.get('/products/:pid', (req, res) => {
  const productId = req.params.pid;
  const product = readJSONFile(productsFilePath).find(p => p.id === productId);
  res.json(product);
});

// Ruta PUT 
router.put('/products/:pid', (req, res) => {
  const productId = req.params.pid;
  const updatedProduct = req.body;
  const products = readJSONFile(productsFilePath);
  const updatedProducts = products.map(p => (p.id === productId ? { ...p, ...updatedProduct } : p));
  writeJSONFile(productsFilePath, updatedProducts);
  res.send(`Producto con ID ${productId} actualizado correctamente`);
});

// Ruta DELETE 
router.delete('/products/:pid', (req, res) => {
  const productId = req.params.pid;
  const products = readJSONFile(productsFilePath);
  const updatedProducts = products.filter(p => p.id !== productId);
  writeJSONFile(productsFilePath, updatedProducts);
  res.send(`Producto con ID ${productId} eliminado correctamente`);
});

module.exports = router;
