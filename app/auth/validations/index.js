const Joi = require("joi")

const { joiError } = require("../../../utils/helpers")
const { errors } = require("../../../utils/texts")

const schemas = {
  register: (data) => {
    const Validation = Joi.object().keys({
      firstName: Joi.string().required().messages({
        "string.base": errors.typeString,
        "string.empty": errors.firstNameRequired,
        "any.required": errors.firstNameRequired,
      }),
      lastName: Joi.string()
        .optional()
        .allow("")
        .messages({ "string.base": errors.typeString }),
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
          "string.email": errors.emailInvalid,
          "string.empty": errors.emailRequired,
          "any.required": errors.emailRequired,
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
  login: (data) => {
    const Validation = Joi.object().keys({
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
          "string.email": errors.emailInvalid,
          "string.empty": errors.emailRequired,
          "any.required": errors.emailRequired,
        }),
      password: Joi.string().required().messages({
        "string.base": errors.typeString,
        "string.empty": errors.passwordRequired,
        "any.required": errors.passwordRequired,
      }),
    })

    return joiError(Validation.validate(data))
  },
  checkEmail: (data) => {
    const Validation = Joi.object().keys({
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
          "string.empty": errors.emailRequired,
          "string.email": errors.emailInvalid,
          "any.required": errors.emailRequired,
        }),
    })

    return joiError(Validation.validate(data))
  },
  checkToken: (data) => {
    const Validation = Joi.object().keys({
      token: Joi.string().required().messages({
        "string.base": errors.typeString,
        "string.empty": errors.tokenRequired,
        "any.required": errors.tokenRequired,
      }),
    })

    return joiError(Validation.validate(data))
  },
  resetPassword: (data) => {
    const Validation = Joi.object().keys({
      token: Joi.string().required().messages({
        "string.base": errors.typeString,
        "string.empty": errors.tokenRequired,
        "any.required": errors.tokenRequired,
      }),
      password: Joi.string().required().messages({
        "string.base": errors.typeString,
        "string.empty": errors.passwordRequired,
        "any.required": errors.passwordRequired,
      }),
    })

    return joiError(Validation.validate(data))
  },
}

module.exports = schemas
