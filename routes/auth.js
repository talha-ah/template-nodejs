const router = require("express").Router()

const authController = require("../controllers/auth")

router.post("/sign-up", authController.register)
router.post("/sign-in", authController.login)
router.post(
  "/request-email-verification",
  authController.requestEmailVerification
)
router.post("/verify-email", authController.verifyEmail)
router.post("/request-password-reset", authController.requestPasswordReset)
router.post("/reset-password", authController.resetPassword)

module.exports = router
