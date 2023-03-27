const Coupon = require("../models/coupon");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const create = asyncHandler(async (req, res) => {
  const { name, discount, expired } = req.body;
  if (!name || !discount || !expired) throw new Error("Missing value");
  req.body.slug = slugify(name);
  const newCoupon = await Coupon.create({
    ...req.body,
    expired: Date.now() + Number(expired * 24 * 60 * 60 * 1000),
  });

  return res.status(200).json({
    success: newCoupon ? true : false,
    msg: newCoupon ? "Create blog  successfully" : "Cannot create blog ",
    data: newCoupon,
  });
});
const getAll = asyncHandler(async (req, res) => {
  const response = await Coupon.find();
  return res.status(200).json({ success: response ? true : false, data: response });
});
const update = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  if (req.body?.name) req.body.slug = slugify(req.body.name);
  if (Object.keys(req.body).length === 0) throw new Error("Has't value for update");
  if (req.body?.expired)
    req.body.expired = Date.now() + Number(req.body.expired * 24 * 60 * 60 * 1000);
  const response = await Coupon.findByIdAndUpdate(cid, req.body, { new: true });
  return res.status(200).json({
    success: response ? true : false,
    msg: response ? "Update coupon successfully" : "Cannot update coupon",
    data: response,
  });
});
const deleted = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const response = await Coupon.findByIdAndDelete(cid);
  return res.status(200).json({
    success: response ? true : false,
    msg: response ? "Delete coupon successfully" : "Cannot Delete coupon",
    // data: response,
  });
});
module.exports = {
  create,
  getAll,
  update,
  deleted,
};
