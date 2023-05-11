const router = require("express").Router();
const ctrls = require("../controllers/internal");

router.get("/", ctrls.get);

module.exports = router;
