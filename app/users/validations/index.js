const Joi = require("joi")

const { errors } = require("../../../utils/texts")
const { joiError } = require("../../../utils/helpers")

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
  getOne: (data) => {
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
      id: Joi.string().length(24).required().messages({
        "string.length": errors.userIdLength,
        "string.empty": errors.userIdRequired,
        "any.required": errors.userIdRequired,
      }),
    })

    return joiError(Validation.validate(data))
  },
}

module.exports = schemas
