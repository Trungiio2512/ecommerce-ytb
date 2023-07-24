const { response } = require("express");
const banner = require("../models/banner");
const asyncHandler = require("express-async-handler");
const cloudinary = require("cloudinary").v2;
const create = asyncHandler(async (req, res) => {
  // const
  // if (!req.files) throw new Error("Images banner require");

  // const images = req.files.map((el) => el.path);
  // const filenames = req.files.map((el) => el.filename)
  // const iamges = [
  //   {
  //     url: "https://img.freepik.com/premium-vector/ar-layout-with-abstract-smartphone-modern-template-web-print-augmented-reality-concept-modern-template-web-print-augmented-reality-concept_122058-746.jpg?w=996",
  //     filename: "",
  //   },
  //   {
  //     url: "https://img.freepik.com/premium-photo/online-shopping-mobile-phone_172660-107.jpg?w=996",
  //     filename: "",
  //   },

  //   {
  //     url: "https://static.vecteezy.com/system/resources/previ…ted-with-smartphone-on-blue-background-vector.jpg",
  //     filename: "",
  //   },
  //   {
  //     url: "https://static.vecteezy.com/system/resources/previ…ted-with-smartphone-on-blue-background-vector.jpg",
  //     filename: "",
  //   },
  // ];
  if (Array.isArray(req.images) && req.images.length > 0) {
    const promises = [];
    for (let image of req.images) {
      promises.push(await banner.create(image));
    }
    await Promise.all(promises)
      .then((response) =>
        res.status(200).json({
          sucess: true,
          msg: "Tạo ảnh thành công",
        }),
      )
      .catch((err) =>
        res.status(200).json({
          sucess: false,
          msg: err.message,
        }),
      );
  } else {
    throw new Error("Ảnh không được để trống");
  }
});
const get = asyncHandler(async (req, res) => {
  const response = await banner.find();
  return res.status(200).json({
    sucess: response ? true : false,
    msg: response ? "Get banner images sucessfully" : "Has problems with the banner",
    data: response,
  });
});
module.exports = {
  create,
  get,
};
