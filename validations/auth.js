const Joi = require("joi")
const { handleError } = require("./error")

const schemas = {
  register: (data) => {
    const Validation = Joi.object().keys({
      firstName: Joi.string().required().messages({
        "string.empty": "First name is required",
        "any.required": "First name is required",
      }),
      last_name: Joi.string().required().messages({
        "string.empty": "Last name is required",
        "any.required": "Last name is required",
      }),
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
          "string.empty": "Email is required",
          "string.email": "Email is not valid",
          "any.required": "Email is required",
        }),
      password: Joi.string()
        .min(8)
        .pattern(/^(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
        .required()
        .messages({
          "string.empty": "Password is required",
          "string.min": "Password must have at least 8 characters",
          "string.pattern.base":
            "Password should contain at least one special character and one number",
          "any.required": "Password is required",
        }),
    })

    return handleError(Validation.validate(data))
  },
  login: (data) => {
    const Validation = Joi.object().keys({
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
          "string.empty": "Email is required",
          "string.email": "Email is not valid",
          "any.required": "Email is required",
        }),
      password: Joi.string().required().messages({
        "string.empty": "Password is required",
        "any.required": "Password is required",
      }),
    })

    return handleError(Validation.validate(data))
  },
  checkEmail: (data) => {
    const Validation = Joi.object().keys({
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
          "string.empty": "Email is required",
          "string.email": "Email is not valid",
          "any.required": "Email is required",
        }),
    })

    return handleError(Validation.validate(data))
  },
  checkToken: (data) => {
    const Validation = Joi.object().keys({
      token: Joi.string().required().messages({
        "string.empty": "Token is required",
        "any.required": "Token is required",
      }),
    })

    return handleError(Validation.validate(data))
  },
  resetPassword: (data) => {
    const Validation = Joi.object().keys({
      token: Joi.string().required().messages({
        "string.empty": "Token is required",
        "any.required": "Token is required",
      }),
      password: Joi.string().required().messages({
        "string.empty": "Password is required",
        "any.required": "Password is required",
      }),
    })

    return handleError(Validation.validate(data))
  },
}

module.exports = schemas
