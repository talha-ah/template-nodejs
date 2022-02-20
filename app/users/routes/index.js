const router = require("express").Router()

const controller = require("../controllers")
const auth = require("../../../middlewares/auth")

router.get("/", auth("admin"), controller.getAll)
router.delete("/:id", auth("admin"), controller.deleteOne)

module.exports = router
