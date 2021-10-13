const router = require("express").Router()

const auth = require("@middlewares/auth")

const controller = require("../controllers")

router.get("/", auth("admin"), controller.getAll)
router.get("/:id", auth("admin"), controller.getOne)
router.delete("/:id", auth("admin"), controller.deleteOne)

module.exports = router
