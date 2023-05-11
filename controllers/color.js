const asyncHandler = require("express-async-handler");
const color = require("../models/color");
const get = asyncHandler(async (req, res) => {
  const rs = await color.find();
  return res.status(200).json({
    sucess: rs ? true : false,
    msg: rs ? "Get successfully" : "Failed to find",
    data: rs,
  });
});

module.exports = {
  get,
};
