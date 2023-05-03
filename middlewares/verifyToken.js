const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
// require("dotenv").config();

const verifyAccessToken = asyncHandler(async (req, res, next) => {
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err)
        return res.status(401).json({
          sucess: false,
          msg: "Token is expired",
        });
      req.user = decode;
      next();
    });
  } else {
    return res.status(401).json({
      sucess: false,
      msg: "Require authentication!!!",
    });
  }
});
const isAdmin = asyncHandler(async (req, res, next) => {
  const { role } = req.user;
  if (role !== "admin") {
    // throw new Error("You are not allowed to router");
    return res.status(401).json({ sucess: false, msg: "You are not allowed to router" });
  }
  next();
});
const isCreator = asyncHandler(async (req, res, next) => {
  const { role } = req.user;
  if (role !== "creator") {
    // throw new Error("You are not allowed to router");
    return res.status(401).json({ sucess: false, msg: "You are not allowed to router" });
  }
  next();
});
const isCreatorOrAdmin = asyncHandler(async (req, res, next) => {
  const { role } = req.user;
  if (role !== "creator" && role !== "admin") {
    // throw new Error("You are not allowed to router");
    return res.status(401).json({ sucess: false, msg: "You are not allowed to router", role });
  }
  next();
});
module.exports = {
  verifyAccessToken,
  isAdmin,
  isCreatorOrAdmin,
  isCreator,
};
