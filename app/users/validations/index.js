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
  getOne: (data) => {
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
}

module.exports = schemas
