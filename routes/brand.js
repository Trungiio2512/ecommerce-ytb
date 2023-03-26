const router = require("express").Router();
const ctrls = require("../controllers/brand");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.get("/", ctrls.getAll);
router.use(verifyAccessToken);
router.use(isAdmin);
router.post("/", ctrls.create);
router.put("/:bid", ctrls.update);
router.delete("/:bid", ctrls.deleted);

module.exports = router;
