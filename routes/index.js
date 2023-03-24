const user = require("./user");
const product = require("./product");
const productCategory = require("./productCategory");
const blogCategory = require("./blogCategory");
const { errorhandler, notFound } = require("../middlewares/errorHandler");
const initRoutes = (app) => {
  app.use("/api/v1/user", user);
  app.use("/api/v1/product", product);
  app.use("/api/v1/product_category", productCategory);
  app.use("/api/v1/blog_category", blogCategory);
  app.use(notFound);
  app.use(errorhandler);
};
module.exports = initRoutes;
