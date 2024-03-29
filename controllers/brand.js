const Brand = require("../models/brand");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const cloudinary = require("cloudinary").v2;
const create = asyncHandler(async (req, res) => {
  if (!req.body.title) throw new Error("Title brand is not available");
  if (Object.keys(req.body).length === 0) throw new Error("Missing value for brand");
  req.body.slug = slugify(req.body.title);
  const newBrand = await Brand.create(req.body);
  return res.status(200).json({
    sucess: newBrand ? true : false,
    msg: newBrand ? "Create brand sucessfully" : "Cannot create brand",
    data: newBrand,
  });
});
const getAll = asyncHandler(async (req, res) => {
  const response = await Brand.find()
    .populate({ path: "categories", select: "title" })
    .select("title _id slug image");
  return res.status(200).json({ sucess: response ? true : false, data: response });
});
const update = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  req.body.slug = slugify(req.body.title);
  const response = await Brand.findByIdAndUpdate(bid, req.body, { new: true });

  return res.status(200).json({
    sucess: response ? true : false,
    msg: response ? "Update brand sucessfully" : "Cannot update brand",
    data: response,
  });
});
const deleted = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const response = await Brand.findByIdAndDelete(bid);
  if (response && response.image.filename) {
    cloudinary.uploader.destroy(response.image.filename);
  }
  return res.status(200).json({
    sucess: response ? true : false,
    msg: response ? "Delete brand sucessfully" : "Cannot Delete brand",
    data: response,
  });
});
module.exports = {
  create,
  update,
  getAll,
  deleted,
};
