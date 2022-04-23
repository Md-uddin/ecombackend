const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const user = require('./routes/user')
const auth = require('./routes/auth')
const products = require('./routes/product')
const Orders = require('./routes/order')
const Cart = require('./routes/cart')
const bodyParser = require('body-parser')

/////////req for reading the body in post of express
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(express.json())
////database connect
mongoose.connect(process.env.MONGO_URL).then(() => console.log('connected to database')).catch((err) => console.log(err));
app.get('/api', (req, res) => {
  res.send("you are trying to fetch data")
})
app.use('/api/user', user);
app.use('/api/auth', auth);
app.use('/api/order', Orders);
app.use('/api/cart', Cart);
app.use('/api/products', products);


app.listen( process.env.PORT || 3000, () => {
  console.log('listening on port 3000')
});