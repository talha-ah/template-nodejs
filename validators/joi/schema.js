const Joi = require("joi");

const schemas = {
  blogPOST: Joi.object().keys({
    page: Joi.number().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
  }),
};

module.exports = schemas;
