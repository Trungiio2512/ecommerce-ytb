const router = require("express").Router();
const ctrls = require("../controllers/blogCategory");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.use(verifyAccessToken);
router.use(isAdmin);
router.get("/", ctrls.getAll);
router.post("/", ctrls.create);
router.put("/:bcid", ctrls.update);
router.delete("/:bcid", ctrls.deleted);

module.exports = router;
