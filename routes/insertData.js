const router = require("express").Router();
const ctrls = require("../controllers/insertData");
const uploader = require("../config/cloudinary.config");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/", ctrls.insertProduct);

module.exports = router;
