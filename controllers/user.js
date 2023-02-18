const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const register = asyncHandler(async (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password || !firstName || !lastName)
    return res.status(400).json({ success: false, msg: "Missing value" });
  const response = await User.create(req.body);
  return res.status(200).json({ success: response ? true : false });
});

module.exports = {
  register,
};
