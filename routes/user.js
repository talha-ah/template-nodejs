const router = require("express").Router()

const auth = require("../middlewares/auth")
const userController = require("../controllers/user")

router.get("/", auth(), userController.getAll)
router.get("/:userId", auth(), userController.getOne)
router.post("/", auth(), userController.create)
router.put("/:userId", auth(), userController.update)
router.delete("/:userId", auth(), userController.delete)

module.exports = router
