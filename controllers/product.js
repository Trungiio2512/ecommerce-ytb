const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const createProduct = asyncHandler(async (req, res) => {
  if (!req.body.title) throw new Error("Title product is not available");
  if (!req.body.files) throw new Error("Images product is not available");
  if (Object.keys(req.body).length === 0) throw new Error("Missing value for product");
  req.body.slug = slugify(req.body.title);
  req.body.files = req.body.files.map((ele) => ele.path);
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
const ratings = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { star, comment, pid } = req.body;
  if (!star || !pid) throw new Error("Missing value");
  const ratingProduct = await Product.findById(pid);
  // console.log(ratingProduct);
  const existRating = ratingProduct?.ratings?.find((el) => el.postedBy.toString() === id);
  if (existRating) {
    //update comment star
    await Product.updateOne(
      { ratings: { $elemMatch: existRating } },
      { $set: { "ratings.$.star": star, "ratings.$.comment": comment } },
      { new: true },
    );
  } else {
    //add star comment
    await Product.findByIdAndUpdate(
      pid,
      { $push: { ratings: { star, comment, postedBy: id } } },
      { new: true },
    );
  }
  // sum star rating
  const updatedProduct = await Product.findById(pid);
  const totalStar = updatedProduct?.ratings.reduce((acc, cur) => acc + Number(cur.star), 0);
  updatedProduct.totalRatings = Math.round((totalStar * 10) / updatedProduct.ratings.length) / 10;

  await updatedProduct.save();
  return res.status(200).json({ success: true, updatedProduct });
});
const uploadImage = asyncHandler(async (req, res, next) => {
  // const { files } = req.files;
  const { pid } = req.params;
  if (req?.file) throw new Error("Missing images file");
  const response = await Product.findByIdAndUpdate(
    pid,
    {
      $push: { images: { $each: req.files.map((ele) => ele.path) } },
    },
    { new: true },
  );
  return res.json({ success: response ? true : false, data: response });
});

module.exports = {
  createProduct,
  getProduct,
  getAllProduct,
  upProduct,
  delProduct,
  ratings,
  uploadImage,
};
