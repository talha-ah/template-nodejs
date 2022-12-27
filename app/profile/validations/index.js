const Joi = require("joi")

const { errors } = require("../../../utils/texts")
const { joiError, checkDateOfBirth } = require("../../../utils/helpers")

const userId = {
  userId: Joi.string().length(24).required().messages({
    "string.base": errors.typeString,
    "string.length": errors.userIdLength,
    "string.empty": errors.userIdRequired,
    "any.required": errors.userIdRequired,
  }),
}

const schemas = {
  checkUserId: (data) => {
    const Validation = Joi.object().keys(userId)

    return joiError(Validation.validate(data))
  },
  updateProfile: (data) => {
    const Validation = Joi.object().keys({
      ...userId,
      firstName: Joi.string().required().messages({
        "string.base": errors.typeString,
        "string.empty": errors.firstNameRequired,
        "any.required": errors.firstNameRequired,
      }),
      lastName: Joi.string().optional().allow("").messages({
        "string.base": errors.typeString,
      }),
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
          "string.email": errors.emailInvalid,
          "string.empty": errors.emailRequired,
          "any.required": errors.emailRequired,
        }),
      phone: Joi.string().optional().allow("").messages({
        "string.base": errors.typeString,
      }),
      image: Joi.string().optional().allow("").messages({
        "string.base": errors.typeString,
      }),
      gender: Joi.string().optional().allow("").messages({
        "string.base": errors.typeString,
      }),
      dob: Joi.string()
        .allow("")
        .optional()
        .custom((value, helper) => {
          let check = checkDateOfBirth(value)
          if (!check) return helper.message(errors.eighteenYearsOld)
          return check
        }),
    })

    return joiError(Validation.validate(data))
  },
  updatePassword: (data) => {
    const Validation = Joi.object().keys({
      ...userId,
      oldPassword: Joi.string().required().messages({
        "string.base": errors.typeString,
        "string.empty": errors.passwordOldRequired,
        "any.required": errors.passwordOldRequired,
      }),
      password: Joi.string()
        .min(8)
        .pattern(/^(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
        .required()
        .messages({
          "string.base": errors.typeString,
          "string.min": errors.passwordMin,
          "string.empty": errors.passwordRequired,
          "any.required": errors.passwordRequired,
          "string.pattern.base": errors.passwordCombination,
        }),
    })

    return joiError(Validation.validate(data))
  },
  updateFcmToken: (data) => {
    const Validation = Joi.object().keys({
      ...userId,
      fcmToken: Joi.string().allow("").required().messages({
        "string.base": errors.typeString,
        "string.empty": errors.fcmRequired,
        "any.required": errors.fcmRequired,
      }),
    })

    return joiError(Validation.validate(data))
  },
  updateTheme: (data) => {
    const Validation = Joi.object().keys({
      ...userId,
      theme: Joi.string().valid("light", "dark", "system").required().messages({
        "any.only": errors.themeInvalid,
        "string.base": errors.typeString,
        "string.empty": errors.themeRequired,
        "any.required": errors.themeRequired,
      }),
    })

    return joiError(Validation.validate(data))
  },
}

module.exports = schemas
