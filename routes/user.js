const router = require("express").Router();
const ctrls = require("../controllers/user");
const ctrlsWL = require("../controllers/wishlist");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/register", ctrls.register);
router.get("/verify_email/:token", ctrls.finalRegister);
router.post("/login", ctrls.login);
router.post("/refresh_token", ctrls.refreshAccessToken);
router.post("/forgot_pass", ctrls.forgotPass);
router.put("/reset_pass/:token", ctrls.resetPass);
router.use(verifyAccessToken);
router.get("/", ctrls.getCurrent);
router.get("/get_wishlist", ctrlsWL.get);
router.post("/wishlist/:pid", ctrlsWL.wishlist);
router.post("/logout", ctrls.logout);
// router.delete("/", ctrls.delUser);
router.put("/current", ctrls.upCurrentUser);
router.put("/up_create_cart", ctrls.upItemOrCreateCart);
router.delete("/del_cart", ctrls.delItemCart);
router.put("/quantity_cart", ctrls.upQuantityProductCart);
router.use(isAdmin);
router.get("/all", ctrls.getUsers);
router.delete("/del", ctrls.delUserByAdmin);

module.exports = router;
