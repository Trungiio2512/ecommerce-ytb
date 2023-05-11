const router = require("express").Router();
const ctrls = require("../controllers/color");

router.get("/", ctrls.get);

module.exports = router;
