const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate" });
  }
};

module.exports = auth;
