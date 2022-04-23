const { verifyToken, verifyTokenAuthorization, verifyTokenAndAdmin } = require('./verifyToken');
const Cart = require('../models/cart');
const router = require('express').Router();
const Cryptojs = require('crypto-js');


/// create product 
router.post("/", verifyToken, async (req, res) => {

  const newCart = new Cart(req.body);
  try {
    const savedProduct = await newCart.save();
    console.log(savedProduct)
    res.send(201).json(savedProduct)
  } catch (err) {
    res.status(500).send(err)
  }

})




router.put("/:id", verifyTokenAuthorization, async (req, res) => {
  try {
    if(!req.params.id) return res.status(401).send("no user found with the given id");
    const updatedCart = await Cart.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.status(201).json(updatedCart);
  } catch (err) {
    console.log(err);
    res.status(500).send(err)
  }
})

///delete 
router.delete("/", verifyTokenAuthorization, async (req, res) => {
  try {
    if(!req.params.id) return res.status(401).send("no Cart found with the given id");
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted")
  } catch (err) {
    // console.log(err);
    res.status(500).send(err);

  }
})
///Get user Cart
router.get("/find/:userId",verifyTokenAuthorization, async (req, res) => {
  try {
  
    const Cart = await Cart.findOne({userId:req.params.userId});
  
    res.status(200).json(Cart);
  } catch (err) {
    // console.log(err);
    res.status(500).send(err);

  }
})
///Get All users
router.get("/",verifyTokenAndAdmin,  async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(Carts)
  } catch (err) {
    console.log(err);
    res.status(500).send(err);

  }
})

module.exports = router;