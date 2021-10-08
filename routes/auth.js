const router = require("express").Router()

const authController = require("../controllers/auth")

router.post("/register", authController.register)
router.post("/login", authController.login)
router.post("/verify-email-request", authController.verifyEmailRequest)
router.post("/verify-email", authController.verifyEmail)
router.post("/reset-password-request", authController.resetPasswordRequest)
router.post("/reset-password", authController.resetPassword)

module.exports = router
