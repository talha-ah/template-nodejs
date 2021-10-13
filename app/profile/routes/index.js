const router = require("express").Router()

const auth = require("@middlewares/auth")

const controller = require("../controllers")

router.get("/", auth(), controller.fetchProfile)
router.put("/", auth(), controller.updateProfile)
router.patch("/", auth(), controller.updatePassword)
router.delete("/", auth(), controller.deactivateProfile)

module.exports = router
