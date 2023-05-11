const ProductCategory = require("../models/productCategory");
const products = require("../models/product");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const create = asyncHandler(async (req, res) => {
  if (!req.body.title) throw new Error("Title product category is not available");
  if (Object.keys(req.body).length === 0) throw new Error("Missing value for product category");
  req.body.slug = slugify(req.body.title);
  const newCategory = await ProductCategory.create(req.body);
  return res.status(200).json({
    sucess: newCategory ? true : false,
    msg: newCategory ? "Create product category sucessfully" : "Cannot create product category",
    data: newCategory,
  });
});
const getAll = asyncHandler(async (req, res) => {
  // const countPd = await
  const response = await ProductCategory.find()
    .select("title _id slug image brands")
    .populate({ path: "brands", select: "title slug image" });
  return res.status(200).json({ sucess: response ? true : false, data: response });
});
const update = asyncHandler(async (req, res) => {
  const { pcid } = req.params;
  req.body.slug = slugify(req.body.title);
  const response = await ProductCategory.findByIdAndUpdate(pcid, req.body, { new: true });
  return res.status(200).json({
    sucess: response ? true : false,
    msg: response ? "Update product category sucessfully" : "Cannot update product category",
    data: response,
  });
});
const deleted = asyncHandler(async (req, res) => {
  const { pcid } = req.params;
  const response = await ProductCategory.findByIdAndDelete(pcid);
  return res.status(200).json({
    sucess: response ? true : false,
    msg: response ? "Delete product category sucessfully" : "Cannot Delete product category",
    // data: response,
  });
});
module.exports = {
  create,
  update,
  getAll,
  deleted,
};
