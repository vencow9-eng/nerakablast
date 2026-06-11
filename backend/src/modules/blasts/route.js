const router = require("express").Router();

const auth = require("../../middlewares/auth");
const controller = require("./controller");

router.get("/", auth, controller.list);
router.get("/:id", auth, controller.detail);
router.post("/start", auth, controller.start);
router.post("/:id/stop", auth, controller.stop);

module.exports = router;