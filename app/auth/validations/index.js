const Joi = require("joi")

const { joiError } = require("../../../utils/joiError")
const { errors } = require("../../../utils/texts")

const schemas = {
  register: (data) => {
    const Validation = Joi.object().keys({
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
      secret: Joi.string().optional().allow(""),
      role: Joi.string()
        .default("user")
        .valid("user", "admin")
        .optional()
        .messages({
          "any.only": errors.roleOnly,
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
        "string.empty": errors.tokenRequired,
        "any.required": errors.tokenRequired,
      }),
    })

    return joiError(Validation.validate(data))
  },
  resetPassword: (data) => {
    const Validation = Joi.object().keys({
      token: Joi.string().required().messages({
        "string.empty": errors.tokenRequired,
        "any.required": errors.tokenRequired,
      }),
      password: Joi.string().required().messages({
        "string.empty": errors.passwordRequired,
        "any.required": errors.passwordRequired,
      }),
    })

    return joiError(Validation.validate(data))
  },
}

module.exports = schemas
