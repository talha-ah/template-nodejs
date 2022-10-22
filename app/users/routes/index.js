const router = require("express").Router()

const controller = require("../controllers")
const auth = require("../../../middlewares/auth")

router.get("/", auth(), controller.getAll)
router.delete("/:id", auth(), controller.deleteOne)

module.exports = router
