const Joi = require("joi")

const { errors } = require("../../../utils/texts")
const { joiError } = require("../../../utils/helpers")

const userId = {
  userId: Joi.string().length(24).required().messages({
    "string.length": errors.userIdLength,
    "string.empty": errors.userIdRequired,
    "any.required": errors.userIdRequired,
  }),
}

const organizationId = {
  organizationId: Joi.string().length(24).required().messages({
    "string.length": errors.organizationIdLength,
    "string.empty": errors.organizationIdRequired,
    "any.required": errors.organizationIdRequired,
  }),
}

const schemas = {
  getSettings: (data) => {
    const Validation = Joi.object().keys({
      ...userId,
      ...organizationId,
      type: Joi.string()
        .default("general")
        .valid("general")
        .optional()
        .allow("")
        .messages({
          "any.only": errors.settingsTypeInvalid,
        }),
    })

    return joiError(Validation.validate(data))
  },
  updateSettings: (data) => {
    const Validation = Joi.object().keys({
      ...userId,
      ...organizationId,
      type: Joi.string().valid("inventory").required().messages({
        "any.only": errors.settingsTypeInvalid,
        "string.empty": errors.settingsTypeRequired,
        "any.required": errors.settingsTypeRequired,
      }),
      settings: Joi.object()
        .required()
        .when("type", {
          is: "inventory",
          then: Joi.object().keys({
            name: Joi.string().required().messages({
              "string.empty": errors.nameRequired,
              "any.required": errors.nameRequired,
            }),
            email: Joi.string()
              .email({ tlds: { allow: false } })
              .required()
              .messages({
                "string.email": errors.emailInvalid,
                "string.empty": errors.emailRequired,
                "any.required": errors.emailRequired,
              }),
            phone: Joi.string().required().messages({
              "string.empty": errors.phoneRequired,
              "any.required": errors.phoneRequired,
            }),
            address: Joi.object()
              .required()
              .keys({
                addressOne: Joi.string().default("").required().messages({
                  "string.empty": errors.addressRequired,
                  "any.required": errors.addressRequired,
                }),
                addressTwo: Joi.string().default("").optional().allow(""),
                addressThree: Joi.string().default("").optional().allow(""),
                zip: Joi.string().default("").optional().allow(""),
                city: Joi.string().default("").optional().allow(""),
                state: Joi.string().default("").optional().allow(""),
                country: Joi.string().default("").optional().allow(""),
              })
              .messages({
                "any.required": errors.addressRequired,
              }),
          }),
        })
        .messages({
          "any.required": errors.settingsRequired,
        }),
    })

    return joiError(Validation.validate(data))
  },
}

module.exports = schemas
