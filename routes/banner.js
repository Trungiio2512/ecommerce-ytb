const router = require("express").Router();
const ctrls = require("../controllers/banner");
const uploader = require("../config/cloudinary.config");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.get("/", ctrls.get);
router.use(verifyAccessToken);
router.use(isAdmin);
router.post("/", uploader.array("images", 10), ctrls.create);

module.exports = router;
