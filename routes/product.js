const { verifyToken, verifyTokenAuthorization, verifyTokenAndAdmin } = require('./verifyToken');
const Product = require('../models/product');
const router = require('express').Router();
const Cryptojs = require('crypto-js');


/// create product 
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  console.log(req.body)
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    console.log(savedProduct)
    res.send(201).json(savedProduct)
  } catch (err) {
    res.status(500).send(err)
  }

})





router.put("/:id", verifyTokenAuthorization, async (req, res) => {


  try {
    const updatedUser = await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.status(201).json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).send(err)
  }
})

///delete 
router.delete("/", verifyTokenAuthorization, async (req, res) => {
  try {
    if(!req.params.id) return res.status(401).send("no user found with the given id");
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("user has been deleted")
  } catch (err) {
    // console.log(err);
    res.status(500).send(err);

  }
})
///Get product details
router.get("/find/:id", async (req, res) => {
  try {
  
    const Product = await Product.find();
  
    res.status(200).json(Product);
  } catch (err) {
    // console.log(err);
    res.status(500).send(err);

  }
})
///Get All users
router.get("/",  async (req, res) => {
  try {
    let products;
    const qnew = req.query.new;
    const qcat = req.query.category;
   console.log(qnew,qcat);
     if(qnew) {
       products = await Product.find().sort({
         createdAt: -1//for newes first
       }).limit(1)
     } else if (qcat) {
       products = await Product.find( { categories: { $in: [qcat] } })
       
     } else {
       products = await Product.find();
    }
    res.status(200).json(products);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);

  }
})

module.exports = router;