const router = require("express").Router();

const auth = require("../../middlewares/auth");
const role = require("../../middlewares/role");
const controller = require("./controller");

router.get("/members", auth, role("ADMIN"), controller.members);

module.exports = router;