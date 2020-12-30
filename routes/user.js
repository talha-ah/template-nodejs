const router = require("express").Router();

const auth = require("../middlewares/auth");
const upload = require("../middlewares/multer");
const userController = require("../controllers/user");

// GETS
router.get("/", auth("admin"), userController.getAll);
router.get("/:userId", auth("admin"), userController.getOne);

// POSTS
router.post("/", auth("user"), upload("image"), userController.create);

// PUTS
router.put("/:userId", auth("admin"), upload("image"), userController.update);

// DELETES
router.delete("/:userId", auth("admin"), userController.delete);

module.exports = router;
