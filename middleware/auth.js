const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const encoded = jwt.verify(token, process.env.privateKey);
    req.user = encoded;

    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
};

module.exports = auth;
