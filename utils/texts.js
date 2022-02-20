const errors = {
  error: "There was an error!",
  notFound: "Resource not found",
  notAuthorized: "Not authorized",

  typeDate: "Value must be a Date",
  typeString: "Value must be a string",
  typeNumber: "Value must be a number",
  typeBoolean: "Value must be a boolean",

  tokenInvalid: "Invalid OR expired token",
  tokenNotFound: "Token not found",
  tokenRequired: "Token is required",

  accountInactive: "Your account is not active! Kindly contact support!",

  userIdRequired: "User id is required",
  userIdLength: "User id length must be 24 characters",
  userNotFound: "User not found. Please check your email and password",

  organizationNotFound: "Organization not found",
  organizationIdRequired: "Organization id is required",
  organizationIdLength: "Organization id length must be 24 characters",

  emailInvalid: "Email is invalid",
  emailRequired: "Email is required",
  emailVerificationPending:
    "Your email is not verified! Kindly verify your email!",

  passwordRequired: "Password is required",
  passwordInvalid: "Password is incorrect!",
  passwordOldInvalid: "Old password is incorrect!",
  passwordSame: "Same passwords not allowed",
  passwordOldRequired: "Old password is required",
  passwordMin: "Password must have at least 8 characters",
  passwordCombination:
    "Password must contain at least one special character and one number",

  imageRequired: "Image is required",
  fcmRequired: "Fcm token is required",
  lastNameRequired: "Last name is required",
  firstNameRequired: "First name is required",
  eighteenYearsOld: "You must be 18 years old or above",

  invalidInvite: "Invalid OR expired invite",
}

const texts = {
  users: "Users",
  invites: "Invites",
  success: "Success",
  profile: "Profile",
  organizations: "Organizations",

  passwordSuccess: "Password updated",
  loginSuccess: "Logged in successfully",
  passwordResetSent: "Password reset code is sent to your email",
  emailConfirmationSent: "Email confirmation code is sent to your email",
}

module.exports = {
  texts,
  errors,
}
