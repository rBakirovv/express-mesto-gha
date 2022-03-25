const { celebrate, Joi, Segments } = require('celebrate');
const { isURL } = require('validator');

const validateURL = (value) => {
  if (!isURL(value, { require_protocol: true })) {
    throw new Error('Неправильный формат ссылки');
  }
  return value;
};

const validateUser = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateURL),
    email: Joi.string().email().min(2).required(),
    password: Joi.string().min(2).required(),
  }),
});

const validateUserData = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const validateUserAvatar = celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().custom(validateURL),
  }),
});

const validateUserCard = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().custom(validateURL),
  }),
});

module.exports = {
  validateUser,
  validateUserData,
  validateUserAvatar,
  validateUserCard,
};
