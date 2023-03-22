const router = require("express").Router();
const ctrls = require("../controllers/product");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.get("/all", ctrls.getAllProduct);
router.get("/:pid", ctrls.getProduct);
router.use(verifyAccessToken);
router.use(isAdmin);
router.post("/create", ctrls.createProduct);
router.delete("/", ctrls.delProduct);
router.put("/:pid", ctrls.upProduct);

module.exports = router;
