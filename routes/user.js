const { verifyToken, verifyTokenAuthorization, verifyTokenAndAdmin } = require('./verifyToken');
const User = require('../models/user');
const router = require('express').Router();
const Cryptojs = require('crypto-js')

router.put("/:id", verifyTokenAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = await Cryptojs.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString();
  }
  console.log("inside put",req.token)
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
      ;
    console.log(updatedUser)
    res.status(201).json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).send(err)
  }
})

///delete 
router.delete("/", verifyTokenAuthorization, async (req, res) => {
  try {
    if(!req.user.id) return res.status(401).send("no user found with the given id");
    await User.findByIdAndDelete(req.user.id);
    res.status(200).json("user has been deleted")
  } catch (err) {
    // console.log(err);
    res.status(500).send(err);

  }
})
///Get admin details
router.get("/admin", verifyTokenAndAdmin, async (req, res) => {
  try {
    if(!req.user.id) return res.status(401).send("no user found with the given id");
    const user = await User.findById(req.user.id);
    if(!user) return res.status(401).send("no user found with this id")
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    // console.log(err);
    res.status(500).send(err);

  }
})
///Get All users
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
   
    const query = req.query.new;
    const users = query ?
      await User.find().sort({ _id: -1 }).limit(5)
      : await User.find()
    if(!users) return res.status(200).send("no users found")
  
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);

  }
})
/////get user stats
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },//it will simple get the users whos createdAt is gte-greaterthan lastyear
      {
        $project: {
          month: { $month: "$createdAt" },/// it will get the month number of createdAt
        }
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 }
        }
      }
    ]);
    res.status(200).json(data);
  } catch (err) {
    
  }
})
module.exports = router;