const router = require("express").Router();
const ctrls = require("../controllers/banner");
const uploader = require("../config/cloudinary.config");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/", uploader.array("images", 10), ctrls.create);
router.get("/", ctrls.get);
router.use(verifyAccessToken);
router.use(isAdmin);

module.exports = router;
