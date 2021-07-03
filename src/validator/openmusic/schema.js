const Joi = require('joi');
     
const MusicPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().min(1900).max(2021).required(),
  performer: Joi.string().required(),
  genre: Joi.string().required(),
  duration: Joi.number().required()
});
 
module.exports = { MusicPayloadSchema };