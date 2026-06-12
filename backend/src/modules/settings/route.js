const router = require("express").Router();

const auth = require("../../middlewares/auth");
const roleGuard = require("../../middlewares/role");
const controller = require("./controller");

router.get("/", controller.get);
router.patch("/", auth, roleGuard("ADMIN"), controller.update);

module.exports = router;
