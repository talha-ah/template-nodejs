const router = require("express").Router()

const controller = require("../controllers")
const auth = require("../../../middlewares/auth")

router.get("/:type", auth(), controller.getSettings)
router.put("/:type", auth(), controller.updateSettings)

module.exports = router
