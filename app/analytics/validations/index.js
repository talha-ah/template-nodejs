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
  getUsers: (data) => {
    const Validation = Joi.object().keys({
      ...userId,
      ...organizationId,
      interval: Joi.string()
        .allow("")
        .optional()
        .valid("week", "month", "year")
        .default("month")
        .messages({
          "string.base": errors.typeString,
          "any.only": errors.invalidInterval,
        }),
    })

    return joiError(Validation.validate(data))
  },
  getUsersChart: (data) => {
    const Validation = Joi.object().keys({
      ...userId,
      ...organizationId,
      interval: Joi.string()
        .allow("")
        .optional()
        .valid("week", "month", "year")
        .default("month")
        .messages({
          "string.base": errors.typeString,
          "any.only": errors.invalidInterval,
        }),
    })

    return joiError(Validation.validate(data))
  },
}

module.exports = schemas
