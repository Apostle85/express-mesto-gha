const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();
const {
  getUsers,
  getUser,
  getProfile,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getProfile);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().alphanum().length(24),
  }),
}), getUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/^https?:\/\/(www.)?[A-Za-z0-9-.]+\.[a-z]+(\/[\w\-.~:/?#[\]@!$&'()*+,;=]*)?(#?)$/),
  }),
}), updateAvatar);

module.exports = router;
