const Brand = require("../models/brand");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const create = asyncHandler(async (req, res) => {
  if (!req.body.title) throw new Error("Title brand is not available");
  if (Object.keys(req.body).length === 0) throw new Error("Missing value for brand");
  req.body.slug = slugify(req.body.title);
  const newBrand = await Brand.create(req.body);
  return res.status(200).json({
    success: newBrand ? true : false,
    msg: newBrand ? "Create brand successfully" : "Cannot create brand",
    data: newBrand,
  });
});
const getAll = asyncHandler(async (req, res) => {
  const response = await Brand.find().select("title _id slug");
  return res.status(200).json({ success: response ? true : false, data: response });
});
const update = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  req.body.slug = slugify(req.body.title);
  const response = await Brand.findByIdAndUpdate(bid, req.body, { new: true });
  return res.status(200).json({
    success: response ? true : false,
    msg: response ? "Update brand successfully" : "Cannot update brand",
    data: response,
  });
});
const deleted = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const response = await Brand.findByIdAndDelete(bid);
  return res.status(200).json({
    success: response ? true : false,
    msg: response ? "Delete brand successfully" : "Cannot Delete brand",
    // data: response,
  });
});
module.exports = {
  create,
  update,
  getAll,
  deleted,
};
