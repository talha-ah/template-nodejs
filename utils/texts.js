module.exports.errors = {
  error: "There was an error!",
  notFound: "Resource not found",
  notAuthorized: "Not authorized",

  idRequired: "Id is required",
  idLength: "Id length must be 24 characters",

  typeDate: "Value must be a Date",
  typeArray: "Value must be a Array",
  typeString: "Value must be a string",
  typeNumber: "Value must be a number",
  typeObject: "Value must be an object",
  typeBoolean: "Value must be a boolean",

  tokenRequired: "Token is required",
  tokenInvalid: "Invalid OR expired token",
  tokenInvalidReset: "Reset code is incorrect",
  tokenNotFound: "Unauthorized access: Token not found",

  refreshTokenInvalid: "Refresh token is invalid",
  refreshTokenRequired: "Refresh token is required",

  alreadyVerified: "Email already verified",
  accountInactive: "Your account is not active! Kindly contact support!",
  accountNotFound: "Account not found. Please sign up before logging in.",
  accountFound:
    "This email is already in use. Please use a different email or try logging in.",
  accountNotFoundResetPassword:
    "Account not found. Please verify that you have entered a correct email.",

  roleInvalid: "Role is invalid",
  roleRequired: "Role is required",

  emailRequired: "Email is required",
  emailInvalid: "Please enter a valid email",

  passwordRequired: "Password is required",
  passwordOldRequired: "Old password is required",
  passwordOldInvalid: "Old password is incorrect",
  passwordMin: "Password must have at least 8 characters",
  passwordSame: "Old password and new password cannot be the same.",
  passwordDoNotMatch: "Please enter the same password for both fields",
  passwordInvalid: "Incorrect password. Please use the correct password.",
  passwordCombination:
    "Password must contain at least one special character and one number",

  usersRequired: "Users are required",
  userIdRequired: "User id is required",
  userIdLength: "User id length must be 24 characters",
  userNotFound: "User not found. Please check your email and password",

  noOrganization: "No organization found",
  organizationNotFound: "Organization not found",
  organizationIdRequired: "Organization id is required",
  organizationNameRequired: "Organization name is required",
  organizationIdLength: "Organization id length must be 24 characters",

  cityRequired: "City is required",
  stateRequired: "State is required",
  countryRequired: "Country is required",
  zipCodeRequired: "Zip code is required",
  addressOneRequired: "Address one is required",
  addressTwoRequired: "Address two is required",
  addressThreeRequired: "Address three is required",

  themeRequired: "Theme is required",
  themeInvalid: "Theme must be either light, dark, or system",

  keyRequired: "Key is required",
  nameRequired: "Name is required",
  roleRequired: "Role is required",
  nameRequired: "Name is required",
  imageRequired: "Image is required",
  phoneRequired: "Phone is required",
  statusInvalid: "Status is invalid",
  imageRequired: "Image is required",
  bucketRequired: "Bucket is required",
  fcmRequired: "Fcm token is required",
  statusRequired: "Status is required",
  lastNameRequired: "Last name is required",
  invalidInvite: "Invalid OR expired invite",
  firstNameRequired: "First name is required",
  currencyTypeInvalid: "Currency type is invalid",
  invalidStatus: "Status must be active or inactive",
  eighteenYearsOld: "You must be 18 years old or above",
  invalidInterval: "Interval must be either week, month, or year",
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
  updateTheme: "Theme Updated",
  profileUpdated: "Profile updated",
  userDeactivated: "User deactivated",
  updateFcmToken: "FCM Token updated",
  passwordUpdated: "Password updated",

  orgUserRemove: "User removed from organization",

  refreshSuccess: "Refreshed token",
  passwordSuccess: "Password updated",
  loginSuccess: "Logged in successfully",
  passwordResetSent: "Password reset code is sent to your email",
  passwordResetSuccess:
    "Password update is successful! Please use your new passsword to login",
  userCreated: "Congratulations! Your account has been created.",
}
