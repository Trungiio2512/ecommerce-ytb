const User = require("../models/user");
const Cart = require("../models/cart");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const uniqid = require("uniqid");
require("dotenv").config();
const { generateAccessToken, generateRefreshToken } = require("../middlewares/jwt");
const sendMailer = require("../untils/sendMailer");
// const register = asyncHandler(async (req, res, next) => {
//   const { email, password, firstName, lastName, mobile } = req.body;
//   if (!email || !password || !firstName || !lastName)
//     return res.status(400).json({ sucess: false, msg: "Missing value" });
//   const user = await User.findOne({ email });
//   if (user) {
//     throw new Error("User has exist");
//   } else {
//     const newUser = await User.create(req.body);
//     const accessToken = generateAccessToken({ id: newUser._id, role: newUser.role });
//     const newrefreshToken = generateRefreshToken({ id: newUser._id });
//     //lưu refresh token vào db
//     await User.findByIdAndUpdate(newUser._id, { refreshToken: newrefreshToken }, { new: true });
//     res.cookie("refreshToken", newrefreshToken, {
//       httpOnly: true,
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });
//     return res.status(200).json({
//       sucess: newUser ? true : false,
//       msg: newUser ? "User already" : "Something is wrong",
//       data: newUser,
//       token: accessToken,
//     });
//   }
// });
const register = asyncHandler(async (req, res, next) => {
  const { email, password, firstName, lastName, mobile } = req.body;
  if (!email || !password || !firstName || !lastName || !mobile)
    return res.status(400).json({ sucess: false, msg: "Missing value" });
  const user = await User.findOne({ email });
  if (user) {
    throw new Error("User has exist");
  } else {
    const token = uniqid();
    res.cookie(
      "user_register",
      { ...req.body, token },
      { httpOnly: true, maxAge: Date.now() + 5 * 1000 },
    );
    const html = `Vui vui lòng nhấn vào đây để xác thực tài khoản.<a href="${process.env.URL_SERVER}/api/v1/user/verify_email/${token}">Click</a>`;
    const data = {
      email,
      html,
      subject: "Hoàn tất đăng ký",
    };
    await sendMailer(data);
    return res.status(200).json({ sucess: true, msg: "Please enter your email to verify" });
  }
});
const finalRegister = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  const { token } = req.params;
  if (cookies?.user_register?.token !== token) {
    res.clearCookie("user_register");
    // throw new Error("Register failed");
    return res.redirect(`${process.env.URL_ClIENT}/verify_email/sucess`);
  } else {
    const { token, ...passData } = cookies.user_register;
    const newUser = await User.create(passData);
    // const newrefreshToken = generateRefreshToken({ id: newUser._id });
    //lưu refresh token vào db
    await User.findByIdAndUpdate(newUser._id, { new: true });
    res.clearCookie("user_register");
    if (newUser) {
      return res.redirect(`${process.env.URL_ClIENT}/verify_email/sucess`);
    } else {
      return res.redirect(`${process.env.URL_ClIENT}/verify_email/failed`);
    }
  }
  // return res.status(200).json("ok");
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ sucess: false, msg: "Missing value" });
  const response = await User.findOne({ email });
  if (response && (await response.isCorrectPassword(password))) {
    const { password, refreshToken, ...passData } = response.toObject();
    const accessToken = generateAccessToken({ id: response._id, role: response?.role });
    const newrefreshToken = generateRefreshToken({ id: response._id });
    //lưu refresh token vào db
    await User.findByIdAndUpdate(response._id, { refreshToken: newrefreshToken }, { new: true });
    res.cookie("refreshToken", newrefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res
      .status(200)
      .json({ sucess: true, msg: "Login succcessfully", token: accessToken, data: passData });
  } else {
    throw new Error("Password is incorrect or email not existing");
  }
});
const getCurrent = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const user = await User.findById(id).select("-refreshToken -password -role");
  // console.log(id);
  return res
    .status(200)
    .json({ sucess: user ? true : false, msg: user ? "sucess" : "User not exists", data: user });
});
const refreshAccessToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken) {
    throw new Error("Token in cookie is invalid");
  }
  jwt.verify(cookie.refreshToken, process.env.JWT_SECRET, async (err, data) => {
    if (err) {
      return res.status(401).json({ sucess: false, msg: "You must be logged in" });
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
  return res.statusCode(200).json({ sucess: true, msg: "Logout sucessfully" });
});
//xác thực bằng cách gửi link qua mail
const forgotPass = asyncHandler(async (req, res) => {
  const { email } = req.body;
  // console.log(email);
  if (!email) throw new Error("Missing email");
  const user = await User.findOne({ email });
  if (!user) throw new Error("User has not exists");
  const resetToken = await user.createPasswordChangeToken();
  await user.save();

  const html = `Xin vui lòng chọn link dưới đây để đổi mật khâu của bạn.Link sẽ hết hạn trong 15p tính từ bây giờ.<strong>${resetToken}</strong>`;

  const data = {
    email,
    // resetToken,
    html,
    subject: "Đây là mã của bạn",
  };
  const send = await sendMailer(data);
  // console.log(send);
  return res.status(200).json({
    sucess: send ? true : false,
    msg: send ? "Send mail sucessfully" : "Failed to send mail",
  });
});
const resetPass = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  if (!password || !token) throw new Error("Missing value");
  const hashToken = crypto.createHash("sha256").update(token).digest("hex");
  console.log(token + " " + hashToken);
  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpired: { $gt: Date.now() },
  });
  // console.log(user);
  if (!user) {
    // user.passwordResetToken = "";
    // user.passwordResetExpired = "";
    throw new Error("Cannot reset password");
  }
  user.password = password;
  user.passwordResetToken = null;
  user.passwordResetExpired = null;
  user.passwordChangeAt = Date.now();
  await user.save();
  return res.status(200).json({
    sucess: user ? true : false,
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
        res.status(500).json({ sucess: false, msg: err });
        return;
      }
      res.status(200).json({ sucess: true, msg: "sucessfully loaded", data: doc });
    });
  // return res.status(200).json({ sucess: result ? true : false, data: result });
});
const delUser = asyncHandler(async (req, res, next) => {
  ``;
  const { id } = req.user;
  if (!id) throw new Error("Missing value for user");
  const result = await User.findByIdAndDelete({ _id: id });
  return res.status(200).json({
    sucess: result ? true : false,
    msg: result ? `User with email ${result.email} succcess` : "Cannot delete user",
  });
});
const upCurrentUser = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  if (!id || Object.keys(req.body).length <= 0) throw new Error("Missing value for user");
  // if (!req.body?.address) throw new Error("Cannot missing address");
  const result = await User.findByIdAndUpdate({ _id: id }, req.body, { new: true }).select(
    "-password -role -refreshToken",
  );
  return res.status(200).json({
    sucess: result ? true : false,
    msg: result ? `User udpate succcessfully` : "Cannot update user",
    data: result,
  });
});
const delUserByAdmin = asyncHandler(async (req, res, next) => {
  const { id } = req.body;
  if (!id) throw new Error("Missing value for user");
  const result = await User.findByIdAndDelete({ _id: id });
  return res.status(200).json({
    sucess: result ? true : false,
    msg: result ? `User delete succcessfully` : "Cannot delete user",
    // data: result,
  });
});
const upItemOrCreateCart = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { pid, quantity, color } = req.body;
  if (!pid || !quantity || !color) throw new Error("Missing value");
  const cartUser = await Cart.findOne({ userBy: id }).select("list");
  let response;
  if (cartUser) {
    const product = cartUser?.list?.find((el) => el?.product.toString() === pid);
    if (product) {
      const productColor = cartUser?.list?.find((el) => el?.color?.toString() === color);
      if (productColor) {
        response = await Cart.updateOne(
          { list: { $elemMatch: productColor } },
          { $set: { "list.$.quantity": +quantity } },
          { new: true },
        );
      } else {
        response = await Cart.findOneAndUpdate(
          { userBy: id },
          {
            $push: { list: { product: pid, quantity, color } },
          },
          { new: true },
        );
      }
    } else {
      response = await User.findByIdAndUpdate(
        id,
        {
          $push: { cart: { product: pid, quantity, color } },
        },
        { new: true },
      );
    }
  } else {
    response = await Cart.create({ userBy: id, list: [{ product: pid, quantity, color }] });
    await User.updateOne({ _id: id }, { $set: { cart: response?._id } });
  }
  return res.status(200).json({
    sucess: response ? true : false,
    msg: response ? "Update cart succcessfully" : "Has problem updating cart",
  });
  // console.log(cart);
});
const upQuantityProductCart = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const { pid, quantity, color } = req.body;
  if (!pid || !quantity || !color) throw new Error("Missing value");
  const cartUser = await User.findById(id).select("cart");
  const product = cartUser?.cart?.find(
    (el) => el?.product.toString() === pid && el?.color === color,
  );
  const response = await User.updateOne(
    { cart: { $elemMatch: product } },
    { $set: { "cart.$.quantity": quantity } },
    { new: true },
  );
  return res.status(200).json({
    sucess: response ? true : false,
    msg: response ? "sucess" : "Failed",
  });
});
const delItemCart = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { pid, color } = req.body;

  const hasIitem = await Cart.findOne({
    userBy: id,
    list: { $elemMatch: { product: pid, color } },
  });
  if (hasIitem) {
    const del = await Cart.updateOne(
      {
        userBy: id,
      },
      {
        $pull: { list: { product: pid, color } },
      },
      { new: true },
    );
    return res.status(200).json({
      sucess: del ? true : false,
      msg: del ? "Delete item sucessfully" : "Can not delete item",
      del,
    });
  } else {
    return res.status(200).json({ sucess: false, msg: "Has not item in cart" });
  }
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
  upItemOrCreateCart,
  upQuantityProductCart,
  finalRegister,
  delItemCart,
};
