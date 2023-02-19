const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateAccessToken = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "10s" });
};
const generateRefreshToken = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "7d" });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
