const router = require("express").Router();

const auth = require("../../middlewares/auth");
const controller = require("./controller");
const roleGuard = require("../../middlewares/role");

router.get("/admin/all", auth, roleGuard("ADMIN"), controller.adminList);
router.get("/", auth, controller.list);
router.post("/", auth, controller.create);
router.delete("/:id", auth, controller.remove);

module.exports = router;
