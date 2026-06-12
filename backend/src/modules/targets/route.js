const router = require("express").Router();
const multer = require("multer");

const auth = require("../../middlewares/auth");
const controller = require("./controller");

const upload = multer({
  storage: multer.memoryStorage(),
});

router.get("/", auth, controller.list);
router.post("/", auth, controller.create);
router.post("/upload", auth, upload.single("file"), controller.upload);
router.patch("/:id", auth, controller.update);
router.delete("/:id", auth, controller.remove);

module.exports = router;
