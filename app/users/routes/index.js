const router = require("express").Router()

const controller = require("../controllers")
const auth = require("../../../middlewares/auth")

router.get("/", auth("admin"), controller.getAll)
router.get("/:userId", auth("admin"), controller.getOne)
router.delete("/:userId", auth("admin"), controller.deleteOne)

module.exports = router
