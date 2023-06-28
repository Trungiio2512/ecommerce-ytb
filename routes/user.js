const router = require("express").Router();
const uploader = require("../config/cloudinary.config");

const ctrls = require("../controllers/user");
const ctrlsWL = require("../controllers/wishlist");
const ctrlsC = require("../controllers/cart");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/register", ctrls.register);
router.get("/verify_email/:token", ctrls.finalRegister);
router.post("/login", ctrls.login);
router.post("/refresh_token", ctrls.refreshAccessToken);
router.post("/forgot_pass", ctrls.forgotPass);
router.put("/reset_pass/:token", ctrls.resetPass);
router.use(verifyAccessToken);
router.get("/info", ctrls.getCurrent);
router.put("/up_info", uploader.single("image"), ctrls.upCurrentUser);
router.get("/get_wishlist", ctrlsWL.get);
router.post("/wishlist/:pid", ctrlsWL.wishlist);
router.post("/logout", ctrls.logout);
// router.delete("/", ctrls.delUser);
router.get("/get_cart", ctrlsC.get);
router.post("/add_create_cart", ctrlsC.addOrCreate);
router.patch("/update_cart/:cid", ctrlsC.update);
router.delete("/del_cart/:cid", ctrlsC.deleteItem);
// router.put("/quantity_cart", ctrlsC.upQuantityProductCart);
router.use(isAdmin);
router.get("/all", ctrls.getUsers);
router.delete("/del_user/:id", ctrls.delUserByAdmin);
router.patch("/up_user/:id", ctrls.upUserByAdmin);

module.exports = router;
