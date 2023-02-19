const router = require("express").Router();
const ctrls = require("../controllers/user");
const { verifyAccessToken } = require("../middlewares/verifyToken");

router.post("/register", ctrls.register);
router.get("/login", ctrls.login);
router.post("/refresh_token", ctrls.refreshAccessToken);
router.use(verifyAccessToken);
router.post("/logout", ctrls.logout);
router.get("/", ctrls.getOne);

module.exports = router;
