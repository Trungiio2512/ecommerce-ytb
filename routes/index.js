const user = require("./user");
const product = require("./product");
const { errorhandler, notFound } = require("../middlewares/errorHandler");
const initRoutes = (app) => {
  app.use("/api/v1/user", user);
  app.use("/api/v1/product", product);
  app.use(notFound);
  app.use(errorhandler);
};
module.exports = initRoutes;
