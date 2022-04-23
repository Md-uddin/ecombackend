const { verifyToken, verifyTokenAuthorization, verifyTokenAndAdmin } = require('./verifyToken');
const Order = require('../models/order');
const router = require('express').Router();



/// create order
router.post("/", verifyToken, async (req, res) => {

  const newOrder = new Order(req.body);
  try {
    const savedProduct = await newOrder.save();
    console.log(savedProduct)
    res.send(201).json(savedProduct)
  } catch (err) {
    res.status(500).send(err)
  }

})



//////update order
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    if(!req.params.id) return res.status(401).send("no user found with the given id");
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.status(201).json(updatedOrder);
  } catch (err) {
    console.log(err);
    res.status(500).send(err)
  }
})

///delete 
router.delete("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    if(!req.params.id) return res.status(401).send("no Order found with the given id");
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted")
  } catch (err) {
    // console.log(err);
    res.status(500).send(err);

  }
})
///Get user Orders
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  console.log(lastMonth,previousMonth);
  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales:"$amount"
        },
      },
      {
        $group: {
          _id: "$month",
          total:{$sum:"$sales"},
        }
      }
    ])
    res.status(200).json(income)
  } catch (err) {
    res.status(500).json(err)
    console.log(err)
  }
  /// get monthly income
 
})

module.exports = router;