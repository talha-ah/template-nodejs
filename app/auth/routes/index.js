const router = require("express").Router()

const controller = require("../controllers")

router.post("/register", controller.register)
router.post("/login", controller.login)
router.post("/verify-email-request", controller.verifyEmailRequest)
router.post("/verify-email", controller.verifyEmail)
router.post("/reset-password-request", controller.resetPasswordRequest)
router.post("/reset-password", controller.resetPassword)

module.exports = router
