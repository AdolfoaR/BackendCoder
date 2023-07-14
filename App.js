const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const socketIO = require('socket.io');
const mongoose = require('mongoose');

const app = express();

// Configuracion Handlebars 
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connectar MongoDB
mongoose.connect('mongodb+srv://pruebamongo:<password>@cluster0.6wtwnwl.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conexión exitosa a la base de datos');
  })
  .catch((error) => {
    console.error('Error de conexión a la base de datos', error);
  });

// Importar models
const Cart = require('./dao/models/cartModel');
const Message = require('./dao/models/messageModel');
const Product = require('./dao/models/productModel');

//  routes
const homeRouter = require('./routes/home');
const realtimeProductsRouter = require('./routes/realtimeproducts');
const apiRouter = require('./routes/api');
const cartsRouter = require('./routes/carts');

// Routes
app.use('/', homeRouter);
app.use('/realtimeproducts', realtimeProductsRouter);
app.use('/api', apiRouter);
app.use('/api', cartsRouter);

// Socket.IO server
const server = app.listen(8080, () => {
  console.log('Servidor funcionando en puerto 8080');
});

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('productAdded', (product) => {
    const newProduct = new Product(product);
    newProduct.save()
      .then(() => {
        io.emit('updateProducts', product);
      })
      .catch((error) => {
        console.error('Error al agregar el producto', error);
      });
  });

  socket.on('productRemoved', (productId) => {
    Product.findByIdAndRemove(productId)
      .then(() => {
        io.emit('removeProduct', productId);
      })
      .catch((error) => {
        console.error('Error al eliminar el producto', error);
      });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});
