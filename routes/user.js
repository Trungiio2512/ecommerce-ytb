const router = require("express").Router();
const ctrls = require("../controllers/user");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/register", ctrls.register);
router.get("/verify_email/:token", ctrls.finalRegister);
router.post("/login", ctrls.login);
router.post("/refresh_token", ctrls.refreshAccessToken);
router.post("/forgot_pass", ctrls.forgotPass);
router.put("/reset_pass/:token", ctrls.resetPass);
router.use(verifyAccessToken);
router.post("/logout", ctrls.logout);
router.get("/", ctrls.getCurrent);
// router.delete("/", ctrls.delUser);
router.put("/current", ctrls.upCurrentUser);
router.put("/cart", ctrls.upCart);
router.put("/quantity_cart", ctrls.upQuantityProductCart);
router.use(isAdmin);
router.get("/all", ctrls.getUsers);
router.delete("/del", ctrls.delUserByAdmin);

module.exports = router;
