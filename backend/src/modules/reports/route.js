const router =
require("express").Router();

const auth =
require("../../middlewares/auth");

const controller =
require("./controller");

router.get(
  "/",
  auth,
  controller.list
);

router.get(
  "/stats",
  auth,
  controller.stats
);

module.exports =
router;