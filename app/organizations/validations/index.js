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

const organization = {
  name: Joi.string().required().messages({
    "string.base": errors.typeString,
    "string.empty": errors.organizationNameRequired,
    "any.required": errors.organizationNameRequired,
  }),
  email: Joi.string().email().optional().allow("").messages({
    "string.base": errors.typeString,
    "string.email": errors.emailInvalid,
  }),
  phone: Joi.string().optional().allow("").messages({
    "string.base": errors.typeString,
  }),
  logo: Joi.string().optional().allow("").messages({
    "string.base": errors.typeString,
  }),
  address: Joi.object({
    addressOne: Joi.string().optional().allow("").messages({
      "string.base": errors.typeString,
    }),
    addressTwo: Joi.string().optional().allow("").messages({
      "string.base": errors.typeString,
    }),
    addressThree: Joi.string().optional().allow("").messages({
      "string.base": errors.typeString,
    }),
    zip: Joi.string().optional().allow("").messages({
      "string.base": errors.typeString,
    }),
    city: Joi.string().optional().allow("").messages({
      "string.base": errors.typeString,
    }),
    state: Joi.string().optional().allow("").messages({
      "string.base": errors.typeString,
    }),
    country: Joi.string().optional().allow("").messages({
      "string.base": errors.typeString,
    }),
  })
    .optional()
    .messages({
      "object.base": errors.typeObject,
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
  getOne: (data) => {
    const Validation = Joi.object().keys({
      ...userId,
      ...organizationId,
    })

    return joiError(Validation.validate(data))
  },
  createOne: (data) => {
    const Validation = Joi.object().keys({
      ...userId,
      ...organization,
    })

    return joiError(Validation.validate(data))
  },
  updateOne: (data) => {
    const Validation = Joi.object().keys({
      ...userId,
      ...organizationId,
      ...organization,
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
  updateUsers: (data) => {
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
  updateUser: (data) => {
    const Validation = Joi.object().keys({
      ...userId,
      ...organizationId,
      ...id,
      ...role,
    })

    return joiError(Validation.validate(data))
  },
  removeUser: (data) => {
    const Validation = Joi.object().keys({
      ...userId,
      ...organizationId,
      ...id,
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
