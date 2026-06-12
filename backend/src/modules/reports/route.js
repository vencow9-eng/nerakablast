const router =
require("express").Router();

const roleGuard = require("../../middlewares/role");

const auth =
require("../../middlewares/auth");

const controller =
require("./controller");

router.get(
  "/",
  auth,
  controller.list
);

router.get("/admin/all", auth, roleGuard("ADMIN"), controller.adminList);

router.get(
  "/stats",
  auth,
  controller.stats
);

module.exports =
router;
