const router = require("express").Router();
const ctrls = require("../controllers/productCategory");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.use(verifyAccessToken);
router.use(isAdmin);
router.get("/", ctrls.getAll);
router.post("/", ctrls.create);
router.put("/:pcid", ctrls.update);
router.delete("/:pcid", ctrls.deleted);

module.exports = router;
