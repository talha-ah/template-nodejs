const Joi = require("joi")

const { errors } = require("../../../utils/texts")
const { joiError } = require("../../../utils/helpers")

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

const schemas = {
  getAll: (data) => {
    const Validation = Joi.object().keys({
      ...userId,
      status: Joi.string().optional().allow(""),
    })

    return joiError(Validation.validate(data))
  },
  checkOne: (data) => {
    const Validation = Joi.object().keys({
      ...userId,
      ...organizationId,
    })

    return joiError(Validation.validate(data))
  },
  getUsers: (data) => {
    const Validation = Joi.object().keys({
      ...userId,
      ...organizationId,
    })

    return joiError(Validation.validate(data))
  },
  removeUser: (data) => {
    const Validation = Joi.object().keys({
      ...userId,
      ...organizationId,
      id: Joi.string().length(24).required().messages({
        "string.base": errors.typeString,
        "string.length": errors.userIdLength,
        "string.empty": errors.userIdRequired,
        "any.required": errors.userIdRequired,
      }),
    })

    return joiError(Validation.validate(data))
  },
  getMetadata: (data) => {
    const Validation = Joi.object().keys({
      ...userId,
      ...organizationId,
      filter: Joi.string().optional().allow("").messages({
        "string.base": errors.typeString,
      }),
    })

    return joiError(Validation.validate(data))
  },
}

module.exports = schemas
