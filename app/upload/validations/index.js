const Joi = require("joi")

const { errors } = require("../../../utils/texts")
const { joiError } = require("../../../utils/helpers")

const schemas = {
  checkId: (data) => {
    const Validation = Joi.object().keys({
      id: Joi.string().required().messages({
        "string.base": errors.typeString,
        "string.empty": errors.idRequired,
        "any.required": errors.idRequired,
      }),
    })

    return joiError(Validation.validate(data))
  },
}

module.exports = schemas
