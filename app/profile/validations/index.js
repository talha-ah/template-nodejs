const Joi = require("joi")

const { errors } = require("../../../utils/texts")
const { joiError } = require("../../../utils/joiError")

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
      first_name: Joi.string().required().messages({
        "string.empty": errors.firstNameRequired,
        "any.required": errors.firstNameRequired,
      }),
      last_name: Joi.string().required().messages({
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
      image: Joi.string().optional().allow("").messages({
        "string.empty": errors.imageRequired,
        "any.required": errors.imageRequired,
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
      old_password: Joi.string().required().messages({
        "string.empty": errors.oldPasswordRequired,
        "any.required": errors.oldPasswordRequired,
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
}

module.exports = schemas
