const router = require("express").Router()

const auth = require("../../../middlewares/auth")

const controller = require("../controllers")

router.get("/", auth("admin"), controller.getAll)
router.get("/:userId", auth("admin"), controller.getOne)
router.delete("/:userId", auth("admin"), controller.deleteOne)

module.exports = router
