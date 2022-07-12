const router = require("express").Router()

const controller = require("../controllers")
const auth = require("../../../middlewares/auth")

router.get("/", auth(), controller.fetchProfile)
router.put("/", auth(), controller.updateProfile)
router.patch("/", auth(), controller.updatePassword)
router.delete("/", auth(), controller.deactivateProfile)

router.put("/fcm", auth(), controller.updateFcmToken)
router.put("/theme", auth(), controller.updateTheme)

module.exports = router
