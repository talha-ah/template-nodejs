const Joi = require("joi")

const { errors } = require("../../../utils/texts")
const { joiError, checkDateOfBirth } = require("../../../utils/helpers")

const schemas = {
  checkUserId: (data) => {
    const Validation = Joi.object().keys({
      userId: Joi.string().required().messages({
        "string.length": errors.userIdLength,
        "string.empty": errors.userIdRequired,
        "any.required": errors.userIdRequired,
      }),
    })

    return joiError(Validation.validate(data))
  },
  updateProfile: (data) => {
    const Validation = Joi.object().keys({
      userId: Joi.string().required().messages({
        "string.length": errors.userIdLength,
        "string.empty": errors.userIdRequired,
        "any.required": errors.userIdRequired,
      }),
      firstName: Joi.string().required().messages({
        "string.empty": errors.firstNameRequired,
        "any.required": errors.firstNameRequired,
      }),
      lastName: Joi.string().required().messages({
        "string.empty": errors.lastNameRequired,
        "any.required": errors.lastNameRequired,
      }),
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
          "string.email": errors.emailInvalid,
          "string.empty": errors.emailRequired,
          "any.required": errors.emailRequired,
        }),
      phone: Joi.string().optional().allow("").messages({}),
      image: Joi.string().optional().allow("").messages({}),
      gender: Joi.string().optional().allow("").messages({}),
      dateOfBirth: Joi.string()
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
      userId: Joi.string().required().messages({
        "string.length": errors.userIdLength,
        "string.empty": errors.userIdRequired,
        "any.required": errors.userIdRequired,
      }),
      oldPassword: Joi.string().required().messages({
        "string.empty": errors.passwordOldRequired,
        "any.required": errors.passwordOldRequired,
      }),
      password: Joi.string()
        .min(8)
        .pattern(/^(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
        .required()
        .messages({
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
      userId: Joi.string().length(24).required().messages({
        "string.length": errors.idLength,
        "string.empty": errors.idRequired,
        "any.required": errors.idRequired,
      }),
      fcmToken: Joi.string().allow("").required().messages({
        "string.empty": errors.fcmRequired,
        "any.required": errors.fcmRequired,
      }),
    })

    return joiError(Validation.validate(data))
  },
}

module.exports = schemas
