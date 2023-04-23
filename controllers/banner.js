const banner = require("../models/banner");
const asyncHandler = require("express-async-handler");
const cloudinary = require("cloudinary").v2;
const create = asyncHandler(async (req, res) => {
  // const
  if (!req.files) throw new Error("Images banner require");

  const images = req.files.map((el) => el.path);
  const filenames = req.files.map((el) => el.filename);

  const response = await banner.create({ images, filenames });
  if (response) {
    return res.status(200).json({ success: true, msg: "Add banner successfully" });
  } else {
    const promiseDelImages = [];
    for (let i of filenames) {
      promiseDelImages.push(await cloudinary.uploader.destroy(i));
    }
    Promise.all(promiseDelImages);
    return res.status(500).json({ success: false, msg: "Has problems uploading images" });
  }
});
const get = asyncHandler(async (req, res) => {
  const response = await banner.find();
  return res.status(200).json({
    success: response ? true : false,
    msg: response ? "Get banner images successfully" : "Has problems with the banner",
    data: response,
  });
});
module.exports = {
  create,
  get,
};
