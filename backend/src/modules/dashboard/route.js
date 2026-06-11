const router = require("express").Router();

const auth = require("../../middlewares/auth");
const role = require("../../middlewares/role");
const controller = require("./controller");

router.get("/admin", auth, role("ADMIN"), controller.admin);
router.get("/staff", auth, controller.staff);
router.get("/member", auth, controller.member);

module.exports = router;