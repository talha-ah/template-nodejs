const Joi = require("joi")

const { joiError } = require("../../../utils/helpers")
const { errors } = require("../../../utils/texts")

const schemas = {
  getAll: (data) => {
    const Validation = Joi.object().keys({
      userId: Joi.string().length(24).required().messages({
        "string.length": errors.userIdLength,
        "string.empty": errors.userIdRequired,
        "any.required": errors.userIdRequired,
      }),
      organizationId: Joi.string().length(24).required().messages({
        "string.length": errors.organizationIdLength,
        "string.empty": errors.organizationIdRequired,
        "any.required": errors.organizationIdRequired,
      }),
    })

    return joiError(Validation.validate(data))
  },
  createOne: (data) => {
    const Validation = Joi.object().keys({
      userId: Joi.string().length(24).required().messages({
        "string.length": errors.userIdLength,
        "string.empty": errors.userIdRequired,
        "any.required": errors.userIdRequired,
      }),
      organizationId: Joi.string().length(24).required().messages({
        "string.length": errors.organizationIdLength,
        "string.empty": errors.organizationIdRequired,
        "any.required": errors.organizationIdRequired,
      }),
      firstName: Joi.string().required().messages({
        "string.empty": errors.firstNameRequired,
        "any.required": errors.firstNameRequired,
      }),
      lastName: Joi.string().optional().allow(""),
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
          "string.email": errors.emailInvalid,
          "string.empty": errors.emailRequired,
          "any.required": errors.emailRequired,
        }),
    })

    return joiError(Validation.validate(data))
  },
  checkInvite: (data) => {
    const Validation = Joi.object().keys({
      token: Joi.string().required().messages({
        "string.empty": errors.tokenRequired,
        "any.required": errors.tokenRequired,
      }),
    })

    return joiError(Validation.validate(data))
  },
  invite: (data) => {
    const Validation = Joi.object().keys({
      userId: Joi.string().length(24).required().messages({
        "string.length": errors.userIdLength,
        "string.empty": errors.userIdRequired,
        "any.required": errors.userIdRequired,
      }),
      organizationId: Joi.string().length(24).required().messages({
        "string.length": errors.organizationIdLength,
        "string.empty": errors.organizationIdRequired,
        "any.required": errors.organizationIdRequired,
      }),
      token: Joi.string().required().messages({
        "string.empty": errors.tokenRequired,
        "any.required": errors.tokenRequired,
      }),
    })

    return joiError(Validation.validate(data))
  },
  acceptInvite: (data) => {
    const Validation = Joi.object().keys({
      token: Joi.string().required().messages({
        "string.empty": errors.tokenRequired,
        "any.required": errors.tokenRequired,
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
