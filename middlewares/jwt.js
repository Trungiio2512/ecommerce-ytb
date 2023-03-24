const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateAccessToken = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "30d" });
};
const generateRefreshToken = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "90d" });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
