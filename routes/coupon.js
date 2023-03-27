const router = require("express").Router();
const ctrls = require("../controllers/coupon");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.get("/", ctrls.getAll);
router.use(verifyAccessToken);
router.use(isAdmin);
router.post("/", ctrls.create);
router.put("/:cid", ctrls.update);
router.delete("/:cid", ctrls.deleted);

module.exports = router;
