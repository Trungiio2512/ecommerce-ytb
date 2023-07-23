const router = require("express").Router();
const ctrls = require("../controllers/product");
const uploader = require("../config/cloudinary.config");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.get("/all", ctrls.getAllProduct);
router.get("/one/:pid", ctrls.getProduct);
router.use(verifyAccessToken);
router.get("/ratings/:pid", ctrls.getAllRatings);
router.post("/comment/:pid", ctrls.ratings);
router.use(isAdmin);
router.post("/create", ctrls.createProduct);
router.delete("/delete/:pid", ctrls.delProduct);
router.patch("/up/:pid", uploader.array("images", 10), uploader.single("thumb"), ctrls.upProduct);
router.put("/upload_image/:pid", uploader.array("images", 10), ctrls.uploadImage);

module.exports = router;
