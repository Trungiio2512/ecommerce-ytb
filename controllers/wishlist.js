const asyncHandler = require("express-async-handler");
const WishtList = require("../models/wishlist");
const wishlist = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const { id } = req.user;
  // const userWishList = await User.findById({ _id: id }).select("wishlist");
  const wishlist = await WishtList.findOne({ userBy: id }).select("list");
  let rs;
  if (wishlist) {
    const product = wishlist.list?.find((pd) => pd.toString() === pid);
    if (product) {
      rs = await WishtList.updateOne(
        { userBy: id },
        {
          $pull: { list: pid },
        },
        { new: true },
      );
    } else {
      rs = await WishtList.updateOne({ userBy: id }, { $push: { list: pid } }, { new: true });
    }
  } else {
    rs = await WishtList.findOneAndUpdate(
      { userBy: id },
      { $push: { list: pid } },
      { upsert: true, new: true },
    );
    await User.updateOne({ _id: id }, { $set: { wishlist: rs._id } });
  }

  return res.status(200).json({
    sucess: rs ? true : false,
    msg: rs ? "Update succcessfully" : "Update Failed",
  });
});
const get = asyncHandler(async (req, res) => {
  const { id } = req.user;
  rs = await WishtList.findOne({ userBy: id })
    .populate({
      path: "list",
      select: "thumb price title priceSale slug",
      populate: { path: "brand category", select: "title slug" },
    })
    .select("list");
  return res.status(200).json({
    sucess: rs ? true : false,
    msg: rs ? "Get successfully completed" : "Couldn't find wish list",
    data: rs,
  });
});

module.exports = {
  wishlist,
  get,
};
