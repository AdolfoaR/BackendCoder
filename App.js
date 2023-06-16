const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const productsFilePath = path.join(__dirname, 'productos.json');
const cartsFilePath = path.join(__dirname, 'carrito.json');


app.use(express.json());

// Ruta GET 
app.get('/api/products', (req, res) => {
  const products = readJSONFile(productsFilePath);
  res.json(products);
});


app.get('/api/products/:pid', (req, res) => {
  const productId = req.params.pid;
  const product = readJSONFile(productsFilePath).find(p => p.id === productId);
  res.json(product);
});

// Ruta PUT 
app.put('/api/products/:pid', (req, res) => {
  const productId = req.params.pid;
  const updatedProduct = req.body;
  const products = readJSONFile(productsFilePath);
  const updatedProducts = products.map(p => (p.id === productId ? { ...p, ...updatedProduct } : p));
  writeJSONFile(productsFilePath, updatedProducts);
  res.send(`Producto con ID ${productId} actualizado correctamente`);
});

// Ruta DELETE 
app.delete('/api/products/:pid', (req, res) => {
  const productId = req.params.pid;
  const products = readJSONFile(productsFilePath);
  const updatedProducts = products.filter(p => p.id !== productId);
  writeJSONFile(productsFilePath, updatedProducts);
  res.send(`Producto con ID ${productId} eliminado correctamente`);
});

// Ruta POST 
app.post('/api/carts', (req, res) => {
  const newCart = {
    id: generateId(),
    products: []
  };
  
  const carts = readJSONFile(cartsFilePath);
  carts.push(newCart);
  writeJSONFile(cartsFilePath, carts);
  res.json(newCart);
});


app.get('/api/carts/:cid', (req, res) => {
  const cartId = req.params.cid;
  const cart = readJSONFile(cartsFilePath).find(c => c.id === cartId);
  res.json(cart);
});


app.post('/api/carts/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;

  
  const carts = readJSONFile(cartsFilePath);
  const cartIndex = carts.findIndex(c => c.id === cartId);

  if (cartIndex !== -1) {
    const cart = carts[cartIndex];
    const existingProductIndex = cart.products.findIndex(p => p.product === productId);

    if (existingProductIndex !== -1) {
      // si el producto ya existe en el carrito aumentar la cantidad
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


function readJSONFile(filePath) {
  try {
    const fileData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error(`Error ${filePath}: ${error}`);
    return [];
  }
}


function writeJSONFile(filePath, data) {
  try {
    const fileData = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, fileData, 'utf-8');
  } catch (error) {
    console.error(`Error ${filePath}: ${error}`);
  }
}


function generateId() {
  return Date.now().toString();
}

//servidor
app.listen(8080, () => {
  console.log('Servidor funcionando en puerto 8080');
});


