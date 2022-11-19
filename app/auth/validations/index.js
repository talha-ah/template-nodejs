const Joi = require("joi")

const { joiError } = require("../../../utils/helpers")
const { errors } = require("../../../utils/texts")

const email = {
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": errors.emailInvalid,
      "string.empty": errors.emailRequired,
      "any.required": errors.emailRequired,
    }),
}
const token = {
  token: Joi.string().required().messages({
    "string.base": errors.typeString,
    "string.empty": errors.tokenRequired,
    "any.required": errors.tokenRequired,
  }),
}
const password = {
  password: Joi.string().required().messages({
    "string.base": errors.typeString,
    "string.empty": errors.passwordRequired,
    "any.required": errors.passwordRequired,
  }),
}

const schemas = {
  authProfile: (data) => {
    const Validation = Joi.object().keys({
      organizationId: Joi.string().length(24).required().messages({
        "string.base": errors.typeString,
        "string.length": errors.organizationIdLength,
        "string.empty": errors.organizationIdRequired,
        "any.required": errors.organizationIdRequired,
      }),
      userId: Joi.string().length(24).required().messages({
        "string.base": errors.typeString,
        "string.length": errors.userIdLength,
        "string.empty": errors.userIdRequired,
        "any.required": errors.userIdRequired,
      }),
    })

    return joiError(Validation.validate(data))
  },
  switchOrganization: (data) => {
    const Validation = Joi.object().keys({
      organizationId: Joi.string().length(24).required().messages({
        "string.base": errors.typeString,
        "string.length": errors.organizationIdLength,
        "string.empty": errors.organizationIdRequired,
        "any.required": errors.organizationIdRequired,
      }),
      userId: Joi.string().length(24).required().messages({
        "string.base": errors.typeString,
        "string.length": errors.userIdLength,
        "string.empty": errors.userIdRequired,
        "any.required": errors.userIdRequired,
      }),
    })

    return joiError(Validation.validate(data))
  },
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
      ...email,
      phone: Joi.string().optional().allow("").messages({
        "string.base": errors.typeString,
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
      ...email,
      ...password,
    })

    return joiError(Validation.validate(data))
  },
  refreshToken: (data) => {
    const Validation = Joi.object().keys({
      refresh_token: Joi.string().required().messages({
        "string.base": errors.typeString,
        "string.empty": errors.refreshTokenRequired,
        "any.required": errors.refreshTokenRequired,
      }),
    })

    return joiError(Validation.validate(data))
  },
  checkEmail: (data) => {
    const Validation = Joi.object().keys(email)

    return joiError(Validation.validate(data))
  },
  checkToken: (data) => {
    const Validation = Joi.object().keys(token)

    return joiError(Validation.validate(data))
  },
  forgotPassword: (data) => {
    const Validation = Joi.object().keys(email)

    return joiError(Validation.validate(data))
  },
  recoverPassword: (data) => {
    const Validation = Joi.object().keys({
      ...token,
      ...password,
    })

    return joiError(Validation.validate(data))
  },
}

module.exports = schemas
