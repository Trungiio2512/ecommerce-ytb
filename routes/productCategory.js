const router = require("express").Router();
const ctrls = require("../controllers/productCategory");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.get("/", ctrls.getAll);
router.use(verifyAccessToken);
router.use(isAdmin);
router.post("/create", ctrls.create);
router.put("/update/:pcid", ctrls.update);
router.delete("/delete/:pcid", ctrls.deleted);

module.exports = router;
