const Product = require("../models/product");
const Category = require("../models/productCategory");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const cloudinary = require("cloudinary").v2;
const createProduct = asyncHandler(async (req, res) => {
  if (!req.body.thumb) throw new Error("Thumbnails must have been provided");
  if (!req.body.images.length > 0) throw new Error("Images must have been provided");
  req.body.slug = slugify(req.body.title);
  const newProduct = await Product.create(req.body);
  if (!newProduct) {
    req.body.thumb.filename && cloudinary.uploader.destroy(req.body.thumb.filename);
    req.body.images.length > 0 && req.body.images.forEach((item) => cloudinary.uploader.destroy(item.filename));
  }
  return res.status(200).json({
    sucess: newProduct ? true : false,
    msg: newProduct ? "Create successfully" : "Create failed",
  });
});
const getProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const product = await Product.findById({ _id: pid })
    .select("-ratings")
    .populate({ path: "brand", model: "Brand", select: "title slug" })
    .populate({ path: "category", model: "Category", select: "title slug" })
    .populate({ path: "rams", model: "Ram", select: "name" })
    .populate({ path: "internals", model: "Internal", select: "name" })
    .populate({ path: "colors", model: "Color", select: "name" });
  return res.status(200).json({
    sucess: product ? true : false,
    msg: product ? "Get product sucessfully" : "Cannot Get product",
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
  // ['1', '2] || 1
  if (queries?.rams) {
    formattedQueries.rams = { $in: queries?.rams };
  }
  if (queries?.colors) {
    formattedQueries.colors = { $in: queries?.colors };
  }
  if (queries?.internals) {
    formattedQueries.internals = { $in: queries?.internals };
  }
  if (isFinite(queries?.priceFrom) && queries?.priceFrom > 0) {
    formattedQueries.price = { $gte: queries?.priceFrom };
  }
  if (isFinite(queries?.priceTo) && queries?.priceTo > 0) {
    formattedQueries.price = { $lte: queries?.priceTo };
  }
  if (queries?.brand) {
    formattedQueries.brand = { $eq: queries?.brand };
  }
  let queriesProduct = Product.find(formattedQueries);
  //sortting
  // abc,efg =>[abc,efg] => abc
  if (req.query?.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    // console.log(sortBy);
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
  queriesProduct
    .populate({ path: "brand", model: "Brand", select: "title slug" })
    .populate({ path: "category", model: "Category", select: "title slug" })
    .populate({ path: "rams", model: "Ram", select: "name" })
    .populate({ path: "internals", model: "Internal", select: "name" })
    .populate({ path: "colors", model: "Color", select: "name" })
    .skip(skip)
    .limit(limit);
  // số lượng sản phâm thoả mãn !== số lượng sản phẩm trả về
  queriesProduct.exec(async (err, response) => {
    if (err) throw new Error(err.message);
    const count = await Product.find(formattedQueries).countDocuments();
    //executed queries
    return res.status(200).json({
      sucess: response ? true : false,
      msg: response ? "Get products sucessfully" : "Cannot get products",
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
    sucess: product ? true : false,
    msg: product ? "Update product sucessfully" : "Cannot update product",
    data: product,
  });
});
const delProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (!pid) throw new Error("Missing value");
  const product = await Product.findByIdAndDelete({ _id: pid });
  return res.status(200).json({
    sucess: product ? true : false,
    msg: product ? "Delete product sucessfully" : "Cannot delete product",
    product,
  });
});
const ratings = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { star, comment } = req.body;
  const { pid } = req.params;
  if (!star || !pid || !comment) throw new Error("Missing value");
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
      { new: true, upsert: true },
    );
  }
  // sum star rating
  const updatedProduct = await Product.findById(pid);
  const totalStar = updatedProduct?.ratings.reduce((acc, cur) => acc + Number(cur.star), 0);
  updatedProduct.totalRatings = Math.round((totalStar * 10) / updatedProduct.ratings.length) / 10;

  await updatedProduct.save();
  return res.status(200).json({ sucess: true, msg: "Nhận xét thành công" });
});
const getAllRatings = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const comment = await Product.findById(pid)
    .select("ratings")
    .populate({ path: "ratings", populate: { path: "postedBy", select: "avatar firstName lastName" } });
  return res.status(200).json({ sucess: comment ? true : false, data: comment });
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
  return res.json({ sucess: response ? true : false, data: response });
});

module.exports = {
  createProduct,
  getProduct,
  getAllProduct,
  upProduct,
  delProduct,
  ratings,
  uploadImage,
  getAllRatings,
};
