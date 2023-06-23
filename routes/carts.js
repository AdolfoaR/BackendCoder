const express = require('express');
const router = express.Router();
const path = require('path');
const { readJSONFile, writeJSONFile, generateId } = require('./utils');

const cartsFilePath = path.join(__dirname, '../carrito.json');

// Ruta POST 
router.post('/carts', (req, res) => {
  const newCart = {
    id: generateId(),
    products: []
  };
  
  const carts = readJSONFile(cartsFilePath);
  carts.push(newCart);
  writeJSONFile(cartsFilePath, carts);
  res.json(newCart);
});

// Ruta GET 
router.get('/carts/:cid', (req, res) => {
  const cartId = req.params.cid;
  const cart = readJSONFile(cartsFilePath).find(c => c.id === cartId);
  res.json(cart);
});

// Ruta POST 
router.post('/carts/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;

  const carts = readJSONFile(cartsFilePath);
  const cartIndex = carts.findIndex(c => c.id === cartId);

  if (cartIndex !== -1) {
    const cart = carts[cartIndex];
    const existingProductIndex = cart.products.findIndex(p => p.product === productId);

    if (existingProductIndex !== -1) {
      // Si el producto ya existe en el carrito, aumentar cantidad
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      // Agregar el producto al carrito
      cart.products.push({ product: productId, quantity });
    }

    writeJSONFile(cartsFilePath, carts);
    res.send(`Producto con ID ${productId} agregado correctamente al carrito con ID ${cartId}`);
  } else {
    res.status(404).send(`No se encontró el carrito con ID ${cartId}`);
  }
});

module.exports = router;
