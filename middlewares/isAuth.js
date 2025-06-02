const jwt = require("jsonwebtoken");
require("dotenv").config();

const isAuth = async (req, res, next) => {
  try {
    const authorization = req.headers["authorization"];
    if (!authorization) {
      return res.status(401).json({ error: "Not authorized" });
    }
    const token = authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Not authorized" });
    }
    const payLoad = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payLoad.userId;
    next();
  } catch (e) {
    res.status(401).json({ error: "Not authorized" });
  }
};

module.exports = isAuth;
