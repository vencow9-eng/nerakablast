const router = require("express").Router();
const controller = require("./controller");
const auth = require("../../middlewares/auth");
const roleGuard = require("../../middlewares/role");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/me", auth, controller.me);
router.get("/admin-test", auth, roleGuard("ADMIN"), function(req, res) {
  res.json({ success: true, message: "Admin access granted" });
});

module.exports = router;
