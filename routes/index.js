const user = require("./user");
const { errorhandler, notFound } = require("../middlewares/errorHandler");
const initRoutes = (app) => {
  app.use("/api/v1/user", user);
  app.use(notFound);
  // app.use(errorhandler);
};
module.exports = initRoutes;
