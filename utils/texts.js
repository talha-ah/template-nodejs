module.exports.errors = {
  error: "There was an error!",
  notAuthorized: "Not authorized",

  idRequired: "Id is required",
  idLength: "Id length must be 24 characters",

  typeArray: "Type must be an array",
  typeString: "Value must be a string",
  typeNumber: "Value must be a number",
  typeBoolean: "Value must be a boolean",

  notFound: "Resource not found",

  accountFound:
    "This email is already in use. Please use a different email or try logging in.",
  accountInactive: "Your account is not active! Kindly contact support!",
  accountNotFound: "Account not found. Please sign up before logging in.",
  accountNotFoundResetPassword:
    "Account not found. Please verify that you have entered a correct email.",

  tokenInvalid: "Invalid token",
  tokenRequired: "Token is required",
  tokenInvalidReset: "Reset code is incorrect",
  tokenNotFound: "Unauthorized access: Token not found",

  userIdRequired: "User id is required",
  userIdLength: "User id length must be 24 characters",
  userNotFound: "User not found. Please check your email and password",

  organizationNotFound: "Organization not found",
  organizationIdRequired: "Organization id is required",
  organizationIdLength: "Organization id length must be 24 characters",

  emailRequired: "Email is required",
  emailInvalid: "Please enter a valid email",

  passwordRequired: "Password is required",
  passwordOldRequired: "Old password is required",
  passwordMin: "Password must have at least 8 characters",
  passwordSame: "Old password and new password cannot be the same.",
  passwordDoNotMatch: "Please enter the same password for both fields",
  passwordInvalid: "Incorrect password. Please use the correct password.",
  passwordCombination:
    "Password must contain at least one special character and one number",

  keyRequired: "Key is required",
  imageRequired: "Image is required",
  bucketRequired: "Bucket is required",
  fcmRequired: "Fcm token is required",
  lastNameRequired: "Last name is required",
  invalidInvite: "Invalid OR expired invite",
  firstNameRequired: "First name is required",
  eighteenYearsOld: "You must be 18 years old or above",

  statusRequired: "Status is required",
  invalidStatus: "Status must be active or inactive",

  nameRequired: "Name is required",
  themeRequired: "Theme is required",
  themeInvalid: "Theme must be either dark or light",
}

module.exports.texts = {
  users: "Users",
  profile: "Profile",
  success: "Success",
  invites: "Invites",
  customers: "Customers",
  categories: "Categories",
  organizations: "Organizations",
  notifications: "Notifications",

  fetchProfile: "Profile",
  profileUpdated: "Profile updated",
  userDeactivated: "User deactivated",
  updateFcmToken: "Updated fcm token",
  passwordUpdated: "Password updated",

  passwordSuccess: "Password updated",
  loginSuccess: "Logged in successfully",
  passwordResetSent: "Password reset code is sent to your email",
  passwordResetSuccess:
    "Password update is successful! Please use your new passsword to login",
  userCreated: "Congratulations! Your account has been created.",
}
