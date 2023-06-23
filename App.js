const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const socketIO = require('socket.io');

const app = express();

// Configuracion de Handlebars 
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Importa los archivos de ruta
const homeRouter = require('./routes/home');
const realtimeProductsRouter = require('./routes/realtimeproducts');
const apiRouter = require('./routes/api');
const cartsRouter = require('./routes/carts');

// Routes
app.use('/', homeRouter);
app.use('/realtimeproducts', realtimeProductsRouter);
app.use('/api', apiRouter);
app.use('/api', cartsRouter);

// IO server
const server = app.listen(8080, () => {
  console.log('Servidor funcionando en puerto 8080');
});

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('productAdded', (product) => {
    // Agregar producto a json
    const products = readJSONFile(productsFilePath);
    products.push(product);
    writeJSONFile(productsFilePath, products);

    
    io.emit('updateProducts', products);
  });

  socket.on('productRemoved', (productId) => {
    // borrar producto de json
    const products = readJSONFile(productsFilePath);
    const updatedProducts = products.filter((product) => product.id !== productId);
    writeJSONFile(productsFilePath, updatedProducts);

    
    io.emit('updateProducts', updatedProducts);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});
