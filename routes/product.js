const router = require("express").Router();
const ctrls = require("../controllers/product");
const uploader = require("../config/cloudinary.config");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.get("/all", ctrls.getAllProduct);
router.get("/:pid", ctrls.getProduct);
router.use(verifyAccessToken);
router.put("/ratings", ctrls.ratings);
router.use(isAdmin);
router.post("/create", uploader.array("images", 10), ctrls.createProduct);
router.delete("/", ctrls.delProduct);
router.put("/:pid", uploader.array("images", 10), ctrls.upProduct);
router.put("/upload_cimage/:pid", uploader.array("images", 10), ctrls.uploadImage);

module.exports = router;
