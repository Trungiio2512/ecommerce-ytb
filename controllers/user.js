const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { generateAccessToken, generateRefreshToken } = require("../middlewares/jwt");
const sendMailer = require("../untils/sendMailer");
const register = asyncHandler(async (req, res, next) => {
  const { email, password, firstName, lastName, mobile } = req.body;
  if (!email || !password || !firstName || !lastName)
    return res.status(400).json({ success: false, msg: "Missing value" });
  const user = await User.findOne({ email });
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
    const { password, role, refreshToken, ...passData } = response.toObject();
    const accessToken = generateAccessToken({ id: response._id, role });
    const newrefreshToken = generateRefreshToken({ id: response._id });
    //lưu refresh token vào db
    await User.findByIdAndUpdate(response._id, { refreshToken: newrefreshToken }, { new: true });
    res.cookie("refreshToken", newrefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res
      .status(200)
      .json({ success: true, msg: "Get sucessfully", token: accessToken, data: passData });
  } else {
    throw new Error("Invalid credentials");
  }
});
const getCurrent = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const user = await User.findById(id).select("-refreshToken -password -role");
  // console.log(id);
  return res
    .status(200)
    .json({ success: user ? true : false, msg: user ? "success" : "User not exists", data: user });
});
const refreshAccessToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken) {
    throw new Error("Token in cookie is invalid");
  }
  jwt.verify(cookie.refreshToken, process.env.JWT_SECRET, async (err, data) => {
    if (err) {
      return res.status(401).json({ success: false, msg: "You must be logged in" });
    }
    const response = await User.findOne({ _id: data.id, refreshToken: cookie.refreshToken });
    const newAccessToken =
      response && generateAccessToken({ id: response._id, role: response.role });
    return res.status(200).json({ succes: response ? true : false, token: newAccessToken });
  });
});
const logout = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const cookie = req.cookies;
  if (!cookie.refreshToken) {
    throw new Error("Token in cookie is invalid");
  }
  await User.findByIdAndUpdate({ _id: id }, { refreshToken: "" }, { new: true });
  res.clearCookie("refreshToken", { httpOnly: true, secure: true });
  return res.statusCode(200).json({ success: true, msg: "Logout successfully" });
});
//xác thực bằng cách gửi link qua mail
const forgotPass = asyncHandler(async (req, res) => {
  const { email } = req.body;
  // console.log(email);
  if (!email) throw new Error("Missing email");
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  const resetToken = await user.createPasswordChangeToken();
  await user.save();

  const html = `Xin vui lòng chọn link dưới đây để đổi mật khâu của bạn.Link sẽ hết hạn trong 5p tính từ bây giờ.<a href =${process.env.URL_SERVER}/api/user/reset_pass/${resetToken}>Click</a>`;

  const data = {
    email,
    resetToken,
    html,
  };
  const send = await sendMailer(data);
  // console.log(send);
  return res.status(200).json({
    success: true,
    msg: send ? "Send mail successfully" : "Failed to send mail",
  });
});
const resetPass = asyncHandler(async (req, res) => {
  const { password, token } = req.body;
  if (!password || !token) throw new Error("Missing value");
  const hashToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpired: { $gt: Date.now() },
  });
  if (!user) {
    throw new Error("Cannot reset password");
  }
  user.password = password;
  user.passwordResetToken = null;
  user.passwordResetExpired = null;
  user.passwordChangeAt = Date.now();
  await user.save();
  return res.status(200).json({
    success: user ? true : false,
    msg: user ? "Updated password sucessfully" : "Update password is wrong",
  });
});
//filting, sorting
const getUsers = asyncHandler(async (req, res, next) => {
  // const result = await User.find().select("-refreshToken -password -role");
  const pageOptions = {
    page: parseInt(req.query.page, 10) <= 1 ? 0 : parseInt(req.query.page, 10) - 1 || 0,
    limit: parseInt(req.query.limit, 10) || 10,
  };

  User.find()
    .skip(pageOptions.page * pageOptions.limit)
    .limit(pageOptions.limit)
    .exec(function (err, doc) {
      if (err) {
        res.status(500).json({ success: false, msg: err });
        return;
      }
      res.status(200).json({ success: true, msg: "Successfully loaded", data: doc });
    });
  // return res.status(200).json({ success: result ? true : false, data: result });
});
const delUser = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  if (!id) throw new Error("Missing value for user");
  const result = await User.findByIdAndDelete({ _id: id });
  return res.status(200).json({
    success: result ? true : false,
    msg: result ? `User with email ${result.email} succcess` : "Cannot delete user",
  });
});
const upCurrentUser = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  if (!id || Object.keys(req.body).length <= 0) throw new Error("Missing value for user");
  const result = await User.findByIdAndUpdate({ _id: id }, req.body, { new: true }).select(
    "-password -role -refreshToken",
  );
  return res.status(200).json({
    success: result ? true : false,
    msg: result ? `User udpate succcessfully` : "Cannot update user",
    data: result,
  });
});
const delUserByAdmin = asyncHandler(async (req, res, next) => {
  const { id } = req.body;
  if (!id) throw new Error("Missing value for user");
  const result = await User.findByIdAndDelete({ _id: id });
  return res.status(200).json({
    success: result ? true : false,
    msg: result ? `User delete succcessfully` : "Cannot delete user",
    // data: result,
  });
});
module.exports = {
  register,
  login,
  getCurrent,
  refreshAccessToken,
  logout,
  forgotPass,
  resetPass,
  getUsers,
  delUser,
  upCurrentUser,
  delUserByAdmin,
};
