const router = require("express").Router();
const ctrls = require("../controllers/brand");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.get("/", ctrls.getAll);
router.use(verifyAccessToken);
router.use(isAdmin);
router.post("/create", ctrls.create);
router.put("/update/:bid", ctrls.update);
router.delete("/delete/:bid", ctrls.deleted);

module.exports = router;
