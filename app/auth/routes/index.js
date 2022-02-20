const router = require("express").Router()

const controller = require("../controllers")

router.post("/login", controller.login)
router.post("/register", controller.register)
router.post("/verify-email-request/:email", controller.verifyEmailRequest)
router.post("/verify-email/:token", controller.verifyEmail)
router.post("/reset-password-request/:email", controller.resetPasswordRequest)
router.post("/reset-password/:token", controller.resetPassword)

router.get("/check/email/:email", controller.checkEmail)
router.get("/check/token/:token", controller.checkToken)

module.exports = router
