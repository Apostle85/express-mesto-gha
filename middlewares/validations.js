const { celebrate, Joi } = require('celebrate');
const regExHTTP = require('../constants/regularExpressions');

const validateSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateSignUp = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regExHTTP),
    about: Joi.string().min(2).max(30),
  }),
});

module.exports = {
  validateSignIn,
  validateSignUp,
};
