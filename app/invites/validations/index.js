const Joi = require("joi")

const { joiError } = require("../../../utils/helpers")
const { errors } = require("../../../utils/texts")

const userId = {
  userId: Joi.string().length(24).required().messages({
    "string.base": errors.typeString,
    "string.length": errors.userIdLength,
    "string.empty": errors.userIdRequired,
    "any.required": errors.userIdRequired,
  }),
}

const organizationId = {
  organizationId: Joi.string().length(24).required().messages({
    "string.base": errors.typeString,
    "string.length": errors.organizationIdLength,
    "string.empty": errors.organizationIdRequired,
    "any.required": errors.organizationIdRequired,
  }),
}

const token = {
  token: Joi.string().required().messages({
    "string.base": errors.typeString,
    "string.empty": errors.tokenRequired,
    "any.required": errors.tokenRequired,
  }),
}

const schemas = {
  getAll: (data) => {
    const Validation = Joi.object().keys({
      ...userId,
      ...organizationId,
      page: Joi.string().optional().allow("").messages({
        "string.base": errors.typeString,
      }),
      limit: Joi.string().optional().allow("").messages({
        "string.base": errors.typeString,
      }),
    })

    return joiError(Validation.validate(data))
  },
  createOne: (data) => {
    const Validation = Joi.object().keys({
      ...userId,
      ...organizationId,
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
    })

    return joiError(Validation.validate(data))
  },
  checkInvite: (data) => {
    const Validation = Joi.object().keys({
      ...token,
    })

    return joiError(Validation.validate(data))
  },
  invite: (data) => {
    const Validation = Joi.object().keys({
      ...userId,
      ...organizationId,
      ...token,
    })

    return joiError(Validation.validate(data))
  },
  acceptInvite: (data) => {
    const Validation = Joi.object().keys({
      ...token,
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
