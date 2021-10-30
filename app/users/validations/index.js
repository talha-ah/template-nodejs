const Joi = require("joi")

const { errors } = require("../../../utils/texts")
const { joiError } = require("../../../utils/joiError")

const schemas = {
  checkUserId: (data) => {
    const Validation = Joi.object().keys({
      userId: Joi.string().length(24).required().messages({
        "string.length": errors.userIdLength,
        "string.empty": errors.userIdRequired,
        "any.required": errors.userIdRequired,
      }),
    })

    return joiError(Validation.validate(data))
  },
}

module.exports = schemas
