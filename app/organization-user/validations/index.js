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

const id = {
  id: Joi.string().length(24).required().messages({
    "string.base": errors.typeString,
    "string.length": errors.userIdLength,
    "string.empty": errors.userIdRequired,
    "any.required": errors.userIdRequired,
  }),
}

const role = {
  role: Joi.string().valid("user", "admin").required().messages({
    "any.only": errors.roleInvalid,
    "string.base": errors.typeString,
    "string.empty": errors.roleRequired,
    "any.required": errors.roleRequired,
  }),
}

const schemas = {
  getAll: (data) => {
    const Validation = Joi.object().keys({
      ...userId,
      ...organizationId,
    })

    return joiError(Validation.validate(data))
  },
  updateMany: (data) => {
    const Validation = Joi.object().keys({
      ...userId,
      ...organizationId,
      users: Joi.array()
        .items(
          Joi.object().keys({
            ...id,
            ...role,
          })
        )
        .required()
        .messages({
          "array.base": errors.typeArray,
          "array.empty": errors.usersRequired,
          "any.required": errors.usersRequired,
        }),
    })

    return joiError(Validation.validate(data))
  },
  updateOne: (data) => {
    const Validation = Joi.object().keys({
      ...userId,
      ...organizationId,
      ...id,
      ...role,
    })

    return joiError(Validation.validate(data))
  },
  removeOne: (data) => {
    const Validation = Joi.object().keys({
      ...userId,
      ...organizationId,
      ...id,
    })

    return joiError(Validation.validate(data))
  },
}

module.exports = schemas
