const router = require('express').Router();
const User = require('../models/user');
const Cryptojs = require('crypto-js');
const jwt = require('jsonwebtoken');
//////Register routes
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username && !password && !email) return res.status(400).send("please enter username,email and password");
  let hashpassword = await Cryptojs.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString();
  const newUser = await new User({
    username: username,
    email: email,
    password:hashpassword ,
  });
  try {
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json(err);
    console.log(err)
  }

})
///////logins

router.post('/login', async(req, res) => {
  try {
    const user = await  User.findOne({ username: req.body.username });
    !user && res.status(401).json("no user found!");
    const hashpassword = Cryptojs.AES.decrypt(user.password, process.env.SECRET_KEY).toString(Cryptojs.enc.Utf8);
console.log(req.socket.remoteAddress)
console.log(req.ip)
    if (hashpassword !== req.body.password) return res.status(401).send("incorrect username or password!");

    else {
      const accessToken = jwt.sign({
        id: user._id,
        isAdmin: user.isAdmin
      }, process.env.JWT_SECRET_KEY, { expiresIn: '30m' });
      
      const { password, ...others } = user._doc;
      res.status(200).json({accessToken});
    }
    
    
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})



module.exports = router;