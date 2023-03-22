const router = require("express").Router();
const ctrls = require("../controllers/user");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/register", ctrls.register);
router.get("/login", ctrls.login);
router.post("/refresh_token", ctrls.refreshAccessToken);
router.use(verifyAccessToken);
router.post("/logout", ctrls.logout);
router.get("/", ctrls.getCurrent);
router.post("/forgot_pass", ctrls.forgotPass);
router.delete("/", ctrls.delUser);
router.put("/reset_pass", ctrls.resetPass);
router.put("/current", ctrls.upCurrentUser);
router.use(isAdmin);
router.get("/all", ctrls.getUsers);
router.delete("/del", ctrls.delUserByAdmin);

module.exports = router;
