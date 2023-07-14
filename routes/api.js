const express = require('express');
const router = express.Router();
const Product = require('../dao/models/productModel');

// Ruta GET '/api/products'
router.get('/products', (req, res) => {
  // Get all products from the database using the Product model
  Product.find()
    .then((products) => {
      res.json(products);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al obtener los productos' });
    });
});

// Ruta GET '/api/products/:pid'
router.get('/products/:pid', (req, res) => {
  const productId = req.params.pid;
  // Find a product by ID in the database using the Product model
  Product.findById(productId)
    .then((product) => {
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al obtener el producto' });
    });
});

// Ruta PUT '/api/products/:pid'
router.put('/products/:pid', (req, res) => {
  const productId = req.params.pid;
  const updatedProduct = req.body;
  // Update a product in the database using the Product model
  Product.findByIdAndUpdate(productId, updatedProduct)
    .then(() => {
      res.send(`Producto con ID ${productId} actualizado correctamente`);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al actualizar el producto' });
    });
});

// Ruta DELETE '/api/products/:pid'
router.delete('/products/:pid', (req, res) => {
  const productId = req.params.pid;
  // Remove a product from the database using the Product model
  Product.findByIdAndRemove(productId)
    .then(() => {
      res.send(`Producto con ID ${productId} eliminado correctamente`);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al eliminar el producto' });
    });
});

module.exports = router;
