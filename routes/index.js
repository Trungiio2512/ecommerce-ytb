const user = require("./user");
const product = require("./product");
const productCategory = require("./productCategory");
const blogCategory = require("./blogCategory");
const blog = require("./blog");
const brand = require("./brand");
const coupon = require("./coupon");
const order = require("./order");
const banner = require("./banner");
const insert = require("./insertData");
const { errorhandler, notFound } = require("../middlewares/errorHandler");
const initRoutes = (app) => {
  app.use("/api/v1/user", user);
  app.use("/api/v1/product", product);
  app.use("/api/v1/product_category", productCategory);
  app.use("/api/v1/blog_category", blogCategory);
  app.use("/api/v1/blog", blog);
  app.use("/api/v1/brand", brand);
  app.use("/api/v1/coupon", coupon);
  app.use("/api/v1/order", order);
  app.use("/api/v1/banner", banner);
  app.use("/api/v1/insert", insert);
  app.use(notFound);
  // app.use(errorhandler);
};
module.exports = initRoutes;
