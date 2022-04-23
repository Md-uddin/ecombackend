const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization 
  if (!authHeader) return res.status(401).json('you are not authorized');
  
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json(err);
    req.user = user;
    
    next();
  })
}
const verifyTokenAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    console.log(req.user)

  if(req.user.id || req.user.isAdmin)
  {
    next()
  } else {
    res.status(403).json("You are not allowed to access ")
    }
  });
}
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
console.log(req.user)
  if(req.user.isAdmin )
  {
    next()
  } else {
  return  res.status(403).json("You are not allowed to access ")
    }
  });
}
module.exports = { verifyTokenAuthorization,verifyTokenAndAdmin,verifyToken };