const Order = require("../models/order");
const User = require("../models/user");
const Coupon = require("../models/coupon");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const create = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { coupon } = req.body;
  const cartUser = await User.findById(id)
    .select("cart")
    .populate("cart.product", "slug title price");
  // console.log(cartUser);
  const products = cartUser?.cart?.map((el) => {
    return { product: el?.product?._id, count: el?.quantity, color: el?.color };
  });
  let totalPrice = cartUser?.cart?.reduce((sum, el) => sum + el?.product?.price * el.quantity, 0);
  if (coupon) {
    const selectedCoupon = await Coupon.findById(coupon);
    totalPrice = Math.round((totalPrice * (1 - +selectedCoupon?.discount / 100)) / 1000) * 1000;
  }

  const rs = await Order.create({ products, total: totalPrice, orderBy: id, coupon });
  return res.status(200).json({
    suscess: rs ? true : false,
    totalPrice,
    data: rs,
  });
});

const updateStatus = asyncHandler(async (req, res) => {
  const { oid } = req.params;
  const { status } = req.body;
  if (!status || !oid) throw new Error("Missing status parameter");
  const response = await Order.findByIdAndUpdate(oid, { status }, { new: true });
  return res.status(200).json({
    suscess: response ? true : false,
    data: response,
  });
});
const gets = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const response = await Order.find({ orderBy: id });
  return res.status(200).json({
    suscess: response ? true : false,
    data: response,
  });
});
const getsByAdmin = asyncHandler(async (req, res) => {
  const response = await Order.find();
  return res.status(200).json({
    suscess: response ? true : false,
    data: response,
  });
});
module.exports = {
  create,
  updateStatus,
  gets,
  getsByAdmin,
};
