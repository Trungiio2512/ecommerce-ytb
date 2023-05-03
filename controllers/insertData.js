const Product = require("../models/product");
const Brand = require("../models/brand");
const productCategory = require("../models/productCategory");
const blog = require("../models/blog");

const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const data = require("../../server/data/ecom.json");
const dataCate = require("../../server/data/cate.json");
const { default: mongoose } = require("mongoose");
const product = async (product) => {
  // awaitj
  const title = product?.brand.charAt(0).toUpperCase() + product?.brand.slice(1).toLowerCase();
  const hasBrand = await Brand.findOne({
    title,
  });
  const hasCate = await productCategory.findOne({ title: product?.category });
  let brandId = hasBrand?._id || new mongoose.Types.ObjectId();
  let cateId = hasCate?._id || new mongoose.Types.ObjectId();
  if (!hasCate) {
    await productCategory.create({
      _id: cateId,
      title: product?.category,
      slug: slugify(product?.category),
      $push: { brands: brandId },
    });
  }
  if (!hasBrand) {
    await Brand.create({
      _id: brandId,
      title,
      slug: slugify(title),
      $push: { categories: cateId },
    });
  }
  let price = Math.round(Number(product?.price?.match(/\d/g).join("")) / 100);
  await Product.create(
    {
      title: product?.name,
      slug: slugify(product?.name),
      specifications: product?.description,
      description: product?.infomations?.DESCRIPTION,
      warranty: product?.infomations?.WARRANTY,
      delivery: product?.infomations?.DELIVERY,
      payment: product?.infomations?.PAYMENT,
      brand: brandId,
      price: price < 1000000 ? price * 1000 : price,
      priceSale: price < 1000000 ? Math.round(price / 2) * 1000 : Math.round(price / 2),
      category: cateId,
      quantity: Math.round(Math.random() * 1000) + 700,
      sold: Math.round(Math.random() * 700),
      images: product?.images,
      thumb: product?.thumb,
      color: "Black",
    },
    { new: true },
  );
};

const catefn = async (cate) => {
  const brandPromise = [];
  for (let i of cate.brands) {
    brandPromise.push(await Brand.findOne({ title: i }).select("_id"));
  }
  // return brandPromise;
  await productCategory.create(
    {
      title: cate?.cate.charAt(0).toUpperCase() + cate?.cate.slice(1).toLowerCase(),
      slug: slugify(cate?.cate),
      image: cate?.image,
      // brandCates: cate?.brands,
      brands: brandPromise,
    },
    { new: true },
  );
};

const brandfn = async (brand) => {
  const has = await Brand.find({ title: brand });
  // console.log(has);
  if (has?.length > 0) {
    return;
  } else {
    await Brand.create({ title: brand, slug: slugify(brand) });
  }
};
const brandCatefn = async (brands, cate) => {
  // const id =
  const titleCate = cate.charAt(0).toUpperCase() + cate.slice(1).toLowerCase();
  const hasCate = await productCategory.findOne({ title: titleCate });
  // console.log(hasCate);
  for (let brand of brands) {
    await Brand.findOneAndUpdate(
      { title: brand },
      { $push: { categories: hasCate?._id } },
      { new: true },
    );
  }
};

const insertProduct = asyncHandler(async (req, res) => {
  const promises = [];

  // for (let i of dataCate) {
  //   promises.push(catefn(i));
  // }
  // for (let dataBrands of dataCate) {
  //   for (let i of dataBrands.brands) {
  //     promises.push(brandfn(i));
  //   }
  // }
  // for (let i of dataCate) {
  //   promises.push(brandCatefn(i?.brands, i?.cate));
  // }
  // for (let i of data) {
  //   promises.push(product(i));
  // }
  // await Promise.all(promises);
  // const product = await Product.find()
  await Product.updateMany({ news: true }, { $set: { totalRatings: 5 } });
  //  console.log(first)

  return res.status(200).json({ msg: "ok" });
});
module.exports = {
  insertProduct,
};
