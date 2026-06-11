const router = require("express").Router();

const auth = require("../../middlewares/auth");
const controller = require("./controller");

router.post("/:deviceId/connect", auth, controller.connect);
router.get("/:deviceId/status", auth, controller.status);
router.get("/:deviceId/qr", controller.qr);
router.post("/:deviceId/disconnect", auth, controller.disconnect);
router.post("/:deviceId/pairing", controller.pairing);

module.exports = router;