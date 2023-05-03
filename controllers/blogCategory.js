const BlogCategory = require("../models/blogCategory");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const create = asyncHandler(async (req, res) => {
  if (!req.body.title) throw new Error("Title blog category is not available");
  if (Object.keys(req.body).length === 0) throw new Error("Missing value for blog category");
  req.body.slug = slugify(req.body.title);
  const newCategory = await BlogCategory.create(req.body);
  return res.status(200).json({
    sucess: newCategory ? true : false,
    msg: newCategory ? "Create blog category sucessfully" : "Cannot create blog category",
    data: newCategory,
  });
});
const getAll = asyncHandler(async (req, res) => {
  const response = await BlogCategory.find().select("title _id slug");
  return res.status(200).json({ sucess: response ? true : false, data: response });
});
const update = asyncHandler(async (req, res) => {
  const { bcid } = req.params;
  req.body.slug = slugify(req.body.title);
  const response = await BlogCategory.findByIdAndUpdate(bcid, req.body, { new: true });
  return res.status(200).json({
    sucess: response ? true : false,
    msg: response ? "Update blog category sucessfully" : "Cannot update blog category",
    data: response,
  });
});
const deleted = asyncHandler(async (req, res) => {
  const { bcid } = req.params;
  const response = await BlogCategory.findByIdAndDelete(bcid);
  return res.status(200).json({
    sucess: response ? true : false,
    msg: response ? "Delete blog category sucessfully" : "Cannot Delete blog category",
    // data: response,
  });
});
module.exports = {
  create,
  update,
  getAll,
  deleted,
};
