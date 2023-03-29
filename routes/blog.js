const router = require("express").Router();
const ctrls = require("../controllers/blog");
const uploader = require("../config/cloudinary.config");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.get("/", ctrls.getAll);
router.get("/one/:bid", ctrls.getBlog);
router.use(verifyAccessToken);
router.put("/like/:bid", ctrls.like);
router.put("/dislike/:bid", ctrls.dislike);
router.use(isAdmin);
router.post("/", uploader.single("image"), ctrls.create);
router.put("/:bid", ctrls.update);
router.delete("/:bid", ctrls.deleted);

module.exports = router;
