const User = require("../models/user");
const Cart = require("../models/cart");
const asyncHandler = require("express-async-handler");

const deleteItem = asyncHandler(async (req, res) => {
  const { id } = req.user;
  // const { pid, color } = req.body;
  const { cid } = req.params;
  const response = await Cart.findOneAndUpdate(
    { userBy: id },
    {
      $pull: { list: { _id: cid } },
    },
    { new: true },
  );
  return res.status(200).json({
    sucess: response ? true : false,
    msg: response ? "Deleted successfully" : "Has not deleted item",
  });
});
const get = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const cartUser = await Cart.findOne({ userBy: id })
    .select("list")
    .populate({
      path: "list.product",
      select: "thumb title price priceSale slug",
      populate: {
        path: "brand category",
        select: "name slug",
      },
    })
    .populate({ path: "list.color", select: "name" })
    .populate({ path: "list.ram", select: "name" })
    .populate({ path: "list.internal", select: "name" });
  return res.status(200).json({
    sucess: cartUser ? true : false,
    msg: cartUser ? "Get cart succcessfully" : "Has problem in server",
    data: cartUser,
  });
});
const addOrCreate = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { pid, quantity, color, internal, ram } = req.body;
  if (!pid || !quantity || !color || !internal || !ram) throw new Error("Missing value");
  const cartUser = await Cart.findOne({ userBy: id }).select("list");
  let response;
  if (cartUser) {
    const product = cartUser.list.find(
      (item) =>
        item.product._id.toString() === pid &&
        item.color._id.toString() === color &&
        item.internal._id.toString() === internal &&
        item.ram._id.toString() === ram,
    );
    if (product) {
      response = await Cart.updateOne(
        { list: { $elemMatch: product } },
        {
          $set: {
            "list.$.quantity": +quantity + +product,
          },
        },
        { new: true },
      );
    } else {
      response = await Cart.updateOne(
        { userBy: id },
        {
          $push: { list: { product: pid, quantity: +quantity, color, internal, ram } },
        },
        { new: true },
      );
    }
  } else {
    response = await Cart.create({
      userBy: id,
      list: [{ product: pid, quantity: +quantity, color, internal, ram }],
    });
    await User.updateOne({ _id: id }, { $set: { cart: response?._id } });
  }

  return res.status(200).json({
    sucess: response ? true : false,
    msg: response ? "Update cart succcessfully" : "Has problem updating cart",
  });
});

const update = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { cid } = req.params;
  const { quantity, color, internal, ram } = req.body;
  if (!cid) throw new Error("Missing value");
  const cartUser = await Cart.findOne({ userBy: id }).select("list");
  const product = cartUser.list.find((item) => item?._id.toString() === cid);
  // let response =;
  const response = await Cart.updateOne(
    { list: { $elemMatch: product } },
    {
      $set: {
        "list.$.quantity": quantity,
        "list.$.color": color,
        "list.$.ram": ram,
        "list.$.internal": internal,
      },
    },
  );
  return res.status(200).json({
    sucess: response ? true : false,
    msg: response ? "Update cart succcessfully" : "Has problem updating cart",
    // response,
  });
});

module.exports = { deleteItem, get, addOrCreate, update };
