const { Schema, model } = require("mongoose");
const Joi = require("joi");

const schema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

const schemaCreate = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  phone: Joi.string().max(12).required(),
  favorite: Joi.boolean(),
});

const schemaPatch = Joi.object({
  available: Joi.bool().required(),
});

const Contact = model("contact", schema);

module.exports = {
  Contact,
  schemaCreate,
  schemaPatch,
};