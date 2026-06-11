const router = require("express").Router();
const controller = require("./controller");
const auth = require("../../middlewares/auth");
const roleGuard = require("../../middlewares/role");

router.get("/", auth, roleGuard("ADMIN"), controller.getUsers);
router.patch("/:id/role", auth, roleGuard("ADMIN"), controller.updateRole);
router.patch("/:id/staff", auth, roleGuard("ADMIN"), controller.updateStaff);

module.exports = router;
