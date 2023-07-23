const Order = require("../models/order");
const Cart = require("../models/cart");
const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const create = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { couponId, cid, totalPrice, address } = req.body;
  if (!cid || !totalPrice || !address) {
    throw new Error("Invalid value for oder");
  }
  const cartUser = await Cart.findOne({ _id: cid }).select("list");
  // console.log(c)

  const rs = await Order.create({
    products: cartUser?.list,
    totalPrice,
    orderBy: id,
    coupon: couponId,
    address,
  });

  if (rs) {
    await Cart.updateOne({ _id: cid }, { $set: { list: [] } });
  }

  return res.status(200).json({
    sucess: rs ? true : false,
  });
});

const updateStatus = asyncHandler(async (req, res) => {
  const { oid } = req.params;
  const { status } = req.body;
  if (!status || !oid) throw new Error("Missing status parameter");
  if (status === "Delivering") {
    const orders = await Order.findById(oid);
    const promises = [];
    orders?.products.forEach(async (product) => {
      promises.push(
        await Product.updateOne(
          { _id: product?._id },
          { $inc: { quantity: -product.quantity }, $inc: { sold: product.quantity } },
        ),
      );
    });
    await Promise.all(promises);
  }
  const response = await Order.findByIdAndUpdate(oid, { status }, { new: true });
  return res.status(200).json({
    sucess: response ? true : false,
    data: response,
  });
});
const gets = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { type } = req.params;
  if (!type) throw new Error("Missing required parameter");
  const filter = {
    orderBy: id,
  };
  if (type) {
    filter.status = type;
  }
  const response = await Order.find(filter).populate({
    path: "products",
    populate: [{ path: "product", select: "thumb title" }, { path: "color" }, { path: "ram" }, { path: "internal" }],
  });

  return res.status(200).json({
    sucess: response ? true : false,
    data: response,
    msg: response ? "Thực hiện thành công" : "Có vấn đề từ server",
  });
});
const getsByAdmin = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  //sortting

  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((field) => delete queries[field]);

  //format lại operators
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, (matchEl) => `$${matchEl}`);

  const formattedQueries = JSON.parse(queryString);

  // filtering
  if (queries?.title) formattedQueries.title = { $regex: queries.title, $options: "i" };

  let queriesOrder = Order.find(formattedQueries);
  //sortting
  // abc,efg =>[abc,efg] => abc
  if (req.query?.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    // console.log(sortBy);
    queriesOrder = queriesOrder.sort(sortBy);
  }
  const page = +req.query?.page || 1;
  const limit = +req.query?.limit || process.env.LIMIT_PRODUCT;
  const skip = (page - 1) * limit;
  queriesOrder
    .populate([
      {
        path: "products",
        populate: [
          {
            path: "product",
            select: "thumb title",
            // match: { title: { $regex: "SONY", $options: "i" } },
          },
          { path: "color" },
          { path: "ram" },
          { path: "internal" },
        ],
      },
      { path: "orderBy", select: "firstName lastName mobile" },
    ])
    .skip(skip)
    .limit(limit);
  queriesOrder.exec(async (err, response) => {
    if (err) throw new Error(err.message);
    const count = await Order.find(formattedQueries).countDocuments();
    //executed queries
    return res.status(200).json({
      sucess: response ? true : false,
      count,
      data: response,
    });
  });
});
module.exports = {
  create,
  updateStatus,
  gets,
  getsByAdmin,
};
