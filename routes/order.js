const router = require("express").Router();
const ctrls = require("../controllers/order");
const {
  verifyAccessToken,
  isCreatorOrAdmin,
  isAdmin,
  isCreator,
} = require("../middlewares/verifyToken");

// router.get("/", ctrls.getAll);
router.use(verifyAccessToken);
router.post("/create", ctrls.create);
router.get("/all", ctrls.gets);
router.get("/all/:type", ctrls.gets);

router.use(isAdmin);
router.put("/update_status/:oid", ctrls.updateStatus);

router.use(isAdmin);
router.get("/all_admin", ctrls.getsByAdmin);

// router.put("/:bcid", ctrls.update);
// router.delete("/:bcid", ctrls.deleted);

module.exports = router;
