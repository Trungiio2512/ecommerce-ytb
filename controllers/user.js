const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { generateAccessToken, generateRefreshToken } = require("../middlewares/jwt");
const register = asyncHandler(async (req, res, next) => {
  const { email, password, firstName, lastName, mobile } = req.body;
  if (!email || !password || !firstName || !lastName)
    return res.status(400).json({ success: false, msg: "Missing value" });
  const user = await User.findOne({ email, mobile });

  if (user) {
    throw new Error("User has exist");
  } else {
    const newUser = await User.create(req.body);
    return res.status(200).json({
      success: newUser ? true : false,
      msg: newUser ? "User already" : "Something is wrong",
    });
  }
});
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, msg: "Missing value" });
  const response = await User.findOne({ email });
  if (response && (await response.isCorrectPassword(password))) {
    const { password, role, ...passData } = response.toObject();
    const accessToken = generateAccessToken({ id: response._id, role });
    const refreshToken = generateRefreshToken({ id: response._id });
    //lưu refresh token vào db
    await User.findByIdAndUpdate(response._id, { refreshToken }, { new: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    return res
      .status(200)
      .json({ success: true, msg: "Get sucessfully", data: passData, token: accessToken });
  } else {
    throw new Error("Invalid credentials");
  }
});
const getOne = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const user = await User.findById(id);
  // console.log(id);
  return res
    .status(200)
    .json({ success: user ? true : false, msg: user ? "success" : "User not exists", data: user });
});
module.exports = {
  register,
  login,
  getOne,
};
