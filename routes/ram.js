const router = require("express").Router();
const ctrls = require("../controllers/ram");

router.get("/", ctrls.get);

module.exports = router;
