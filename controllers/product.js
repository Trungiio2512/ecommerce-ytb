const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const createProduct = asyncHandler(async (req, res) => {
  if (!req.body.title) throw new Error("Title product is not available");
  if (Object.keys(req.body).length === 0) throw new Error("Missing value for product");
  req.body.slug = slugify(req.body.title);
  const newProduct = await Product.create(req.body);
  return res.status(200).json({
    success: newProduct ? true : false,
    msg: newProduct ? "Create product successfully" : "Cannot create product",
    data: newProduct,
  });
});
const getProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const product = await Product.findById({ _id: pid });
  return res.status(200).json({
    success: product ? true : false,
    msg: product ? "Get product successfully" : "Cannot Get product",
    data: product,
  });
});
const getAllProduct = asyncHandler(async (req, res) => {
  // const { pid } = req.params;
  const queries = { ...req.query };

  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((field) => delete queries[field]);

  //format lại operators
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, (matchEl) => `$${matchEl}`);
  // const formattedQueries = queryString.replace(/\b(gte|gt|lt|lte)\b/g, (matchEl) => `$${matchEl}`);
  const formattedQueries = JSON.parse(queryString);

  //filtering
  if (queries?.title) formattedQueries.title = { $regex: queries.title, $options: "i" };
  let queriesProduct = Product.find(formattedQueries);
  //sortting
  if (req.query?.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    console.log(sortBy);
    queriesProduct = queriesProduct.sort(sortBy);
  }

  //fields limitting
  if (req.query?.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queriesProduct = queriesProduct.select(fields);
  }

  //panigation
  const page = +req.query?.page || 1;
  const limit = +req.query?.limit || process.env.LIMIT_PRODUCT;
  const skip = (page - 1) * limit;
  queriesProduct.skip(skip).limit(limit);
  // số lượng sản phâm thoả mãn !== số lượng sản phẩm trả về
  queriesProduct.exec(async (err, response) => {
    if (err) throw new Error(err.message);
    const count = await Product.find(formattedQueries).countDocuments();
    //executed queries
    return res.status(200).json({
      success: response ? true : false,
      msg: response ? "Get products successfully" : "Cannot get products",
      count,
      data: response,
    });
  });
  //sortting
});
const upProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("You need value for change product");
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  const product = await Product.findByIdAndUpdate({ _id: pid }, req.body, { new: true });
  return res.status(200).json({
    success: product ? true : false,
    msg: product ? "Update product successfully" : "Cannot update product",
    data: product,
  });
});
const delProduct = asyncHandler(async (req, res) => {
  const { pid } = req.body;
  if (!pid) throw new Error("Missing value");
  const product = await Product.findByIdAndDelete({ _id: pid });
  return res.status(200).json({
    success: product ? true : false,
    msg: product ? "Delete product successfully" : "Cannot delete product",
    data: product,
  });
});
const ratings = asyncHandler(async (req, res) => {});
module.exports = {
  createProduct,
  getProduct,
  getAllProduct,
  upProduct,
  delProduct,
  ratings,
};
