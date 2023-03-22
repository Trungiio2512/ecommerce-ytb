const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
// require("dotenv").config();

const verifyAccessToken = asyncHandler(async (req, res, next) => {
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err)
        return res.status(401).json({
          success: false,
          mes: "Token is expired",
        });
      req.user = decode;
      next();
    });
  } else {
    return res.status(401).json({
      success: false,
      mes: "Require authentication!!!",
    });
  }
});
const isAdmin = asyncHandler(async (req, res, next) => {
  const { role } = req.user;
  if (role !== "admin") {
    // throw new Error("You are not allowed to router");
    return res.status(401).json({ success: false, msg: "You are not allowed to router" });
  }
  next();
});
module.exports = {
  verifyAccessToken,
  isAdmin,
};
