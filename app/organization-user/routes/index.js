const router = require("express").Router()

const controller = require("../controllers")
const auth = require("../../../middlewares/auth")

router.get("/", auth(), controller.getAll)
router.put("/", auth(), controller.updateMany)
router.put("/:id", auth(), controller.updateOne)
router.delete("/:id", auth(), controller.removeOne)

module.exports = router
