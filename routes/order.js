const router = require("express").Router();
const ctrls = require("../controllers/order");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

// router.get("/", ctrls.getAll);
router.use(verifyAccessToken);
router.post("/", ctrls.create);
router.use(isAdmin);
// router.put("/:bcid", ctrls.update);
// router.delete("/:bcid", ctrls.deleted);

module.exports = router;
