const Order = require("../models/order");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const create = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const cart = await User.findById(id).select("cart");
});
module.exports = {
  create,
};
